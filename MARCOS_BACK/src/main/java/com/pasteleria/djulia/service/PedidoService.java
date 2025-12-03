package com.pasteleria.djulia.service;

import com.pasteleria.djulia.dto.CambiarEstadoRequest;
import com.pasteleria.djulia.dto.DetallePedidoRequest;
import com.pasteleria.djulia.dto.PedidoRequest;
import com.pasteleria.djulia.model.*;
import com.pasteleria.djulia.repository.HistorialEstadoRepository;
import com.pasteleria.djulia.repository.PedidoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final HistorialEstadoRepository historialRepository;
    private final ProductoService productoService;
    private final Path comprobantesPath = Paths.get("src/main/resources/static/comprobantes");

    @Transactional
    public Pedido crearPedido(PedidoRequest request, MultipartFile comprobanteYape, Usuario cliente) {
        if (comprobanteYape == null || comprobanteYape.isEmpty()) {
            throw new RuntimeException("Debe subir el comprobante de pago Yape");
        }

        if (request.getTipoEntrega() == TipoEntrega.DELIVERY) {
            if (request.getDireccionEntrega() == null || request.getDireccionEntrega().isEmpty()) {
                throw new RuntimeException("La dirección de entrega es obligatoria para delivery");
            }
            if (request.getTelefonoContacto() == null || request.getTelefonoContacto().isEmpty()) {
                throw new RuntimeException("El teléfono de contacto es obligatorio para delivery");
            }
        }

        String timestamp = String.valueOf(System.currentTimeMillis());
        String rutaComprobante = guardarComprobanteTemp(comprobanteYape, timestamp);

        Pedido pedido = new Pedido();
        pedido.setUsuario(cliente);
        pedido.setEstado(EstadoPedido.POR_CONFIRMAR);
        pedido.setTipoEntrega(request.getTipoEntrega());
        pedido.setDireccionEntrega(request.getDireccionEntrega());
        pedido.setTelefonoContacto(request.getTelefonoContacto());
        pedido.setReferencia(request.getReferencia());
        pedido.setObservaciones(request.getObservaciones());

        double total = 0.0;
        for (DetallePedidoRequest detalleReq : request.getDetalles()) {
            Producto producto = productoService.buscarPorId(detalleReq.getProductoId());

            if (producto.getStock() < detalleReq.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para " + producto.getNombre());
            }

            DetallePedido detalle = new DetallePedido();
            detalle.setPedido(pedido);
            detalle.setProducto(producto);
            detalle.setCantidad(detalleReq.getCantidad());
            detalle.setPrecioUnitario(producto.getPrecio());

            pedido.getDetalles().add(detalle);
            total += detalle.getCantidad() * detalle.getPrecioUnitario();
        }

        pedido.setTotal(total);
        pedido.setComprobanteYape(rutaComprobante);
        pedido.setNumeroYape(request.getNumeroYape());
        pedido.setEstadoPago(EstadoPago.PENDIENTE_VERIFICACION);
        pedido.setFechaSubidaComprobante(LocalDateTime.now());

        Pedido pedidoGuardado = pedidoRepository.save(pedido);

        registrarCambioEstado(pedidoGuardado, null, EstadoPedido.POR_CONFIRMAR, cliente,
                "Pedido creado con comprobante Yape");

        return pedidoGuardado;
    }

    @Transactional
    public Pedido cambiarEstado(Long pedidoId, CambiarEstadoRequest request, Usuario usuario) {
        Pedido pedido = buscarPorId(pedidoId);
        EstadoPedido estadoAnterior = pedido.getEstado();

        validarTransicionEstado(estadoAnterior, request.getNuevoEstado(), pedido.getTipoEntrega());

        if (estadoAnterior == EstadoPedido.POR_CONFIRMAR &&
                request.getNuevoEstado() == EstadoPedido.CONFIRMADO) {

            if (pedido.getEstadoPago() != EstadoPago.VERIFICADO) {
                throw new RuntimeException("Debes verificar el pago antes de confirmar el pedido");
            }

            descontarStock(pedido);
        }

        if (request.getNuevoEstado() == EstadoPedido.CANCELADO) {
            if (estadoAnterior == EstadoPedido.CONFIRMADO ||
                    estadoAnterior == EstadoPedido.EN_PREPARACION ||
                    estadoAnterior == EstadoPedido.LISTO_PARA_RECOGER ||
                    estadoAnterior == EstadoPedido.EN_CAMINO) {

                devolverStock(pedido);
            }
        }

        pedido.setEstado(request.getNuevoEstado());

        Pedido pedidoActualizado = pedidoRepository.save(pedido);

        registrarCambioEstado(pedidoActualizado, estadoAnterior, request.getNuevoEstado(),
                usuario, request.getObservacion());

        return pedidoActualizado;
    }

    @Transactional
    public Pedido verificarPago(Long pedidoId, Usuario vendedor) {
        Pedido pedido = buscarPorId(pedidoId);

        if (pedido.getEstadoPago() == EstadoPago.VERIFICADO) {
            throw new RuntimeException("El pago ya fue verificado anteriormente");
        }

        if (pedido.getEstadoPago() == EstadoPago.RECHAZADO) {
            throw new RuntimeException("Este pago fue rechazado. El cliente debe crear un nuevo pedido");
        }

        pedido.setEstadoPago(EstadoPago.VERIFICADO);

        Pedido pedidoActualizado = pedidoRepository.save(pedido);

        registrarCambioEstado(pedidoActualizado, pedido.getEstado(), pedido.getEstado(),
                vendedor, "Pago Yape verificado correctamente");

        return pedidoActualizado;
    }

    @Transactional
    public Pedido rechazarPago(Long pedidoId, String motivo, Usuario vendedor) {
        Pedido pedido = buscarPorId(pedidoId);

        if (pedido.getEstado() != EstadoPedido.POR_CONFIRMAR) {
            throw new RuntimeException("Solo puedes rechazar pagos de pedidos 'Por Confirmar'");
        }

        if (pedido.getEstadoPago() == EstadoPago.VERIFICADO) {
            throw new RuntimeException("No puedes rechazar un pago ya verificado");
        }

        pedido.setEstadoPago(EstadoPago.RECHAZADO);
        pedido.setEstado(EstadoPedido.CANCELADO);

        String observacionActual = pedido.getObservaciones() != null ?
                pedido.getObservaciones() + "\n" : "";
        pedido.setObservaciones(observacionActual +
                "PAGO RECHAZADO: " + motivo +
                " - " + LocalDateTime.now());

        Pedido pedidoActualizado = pedidoRepository.save(pedido);

        registrarCambioEstado(pedidoActualizado, EstadoPedido.POR_CONFIRMAR,
                EstadoPedido.CANCELADO, vendedor,
                "Pedido cancelado por pago rechazado: " + motivo);

        return pedidoActualizado;
    }

    private void descontarStock(Pedido pedido) {
        for (DetallePedido detalle : pedido.getDetalles()) {
            Producto producto = detalle.getProducto();

            if (producto.getStock() < detalle.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para " + producto.getNombre() +
                        ". Stock disponible: " + producto.getStock());
            }

            producto.setStock(producto.getStock() - detalle.getCantidad());
        }
    }

    private void devolverStock(Pedido pedido) {
        for (DetallePedido detalle : pedido.getDetalles()) {
            Producto producto = detalle.getProducto();
            producto.setStock(producto.getStock() + detalle.getCantidad());
        }
    }

    public Pedido buscarPorId(Long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado con ID: " + id));
    }

    public List<Pedido> listarTodos() {
        return pedidoRepository.findAllByOrderByFechaPedidoDesc();
    }

    public List<Pedido> listarPorCliente(Usuario cliente) {
        return pedidoRepository.findByUsuarioOrderByFechaPedidoDesc(cliente);
    }

    public List<Pedido> listarPorEstado(EstadoPedido estado) {
        return pedidoRepository.findByEstadoOrderByFechaPedidoDesc(estado);
    }

    public List<HistorialEstado> obtenerHistorial(Long pedidoId) {
        Pedido pedido = buscarPorId(pedidoId);
        return historialRepository.findByPedidoOrderByFechaCambioDesc(pedido);
    }

    private void registrarCambioEstado(Pedido pedido, EstadoPedido estadoAnterior,
                                       EstadoPedido estadoNuevo, Usuario usuario, String observacion) {
        HistorialEstado historial = new HistorialEstado();
        historial.setPedido(pedido);
        historial.setEstadoAnterior(estadoAnterior);
        historial.setEstadoNuevo(estadoNuevo);
        historial.setUsuarioCambio(usuario);
        historial.setObservacion(observacion);

        historialRepository.save(historial);
    }

    private void validarTransicionEstado(EstadoPedido actual, EstadoPedido nuevo, TipoEntrega tipoEntrega) {
        if (actual == EstadoPedido.ENTREGADO || actual == EstadoPedido.CANCELADO) {
            throw new RuntimeException("No se puede cambiar el estado de un pedido " + actual.getDescripcion());
        }

        switch (actual) {
            case POR_CONFIRMAR:
                if (nuevo != EstadoPedido.CONFIRMADO && nuevo != EstadoPedido.CANCELADO) {
                    throw new RuntimeException("Desde 'Por Confirmar' solo se puede pasar a 'Confirmado' o 'Cancelado'");
                }
                break;
            case CONFIRMADO:
                if (nuevo != EstadoPedido.EN_PREPARACION && nuevo != EstadoPedido.CANCELADO) {
                    throw new RuntimeException("Desde 'Confirmado' solo se puede pasar a 'En Preparación' o 'Cancelado'");
                }
                break;
            case EN_PREPARACION:
                if (tipoEntrega == TipoEntrega.RECOJO_TIENDA) {
                    if (nuevo != EstadoPedido.LISTO_PARA_RECOGER && nuevo != EstadoPedido.CANCELADO) {
                        throw new RuntimeException("Desde 'En Preparación' solo se puede pasar a 'Listo para Recoger' o 'Cancelado'");
                    }
                } else {
                    if (nuevo != EstadoPedido.EN_CAMINO && nuevo != EstadoPedido.CANCELADO) {
                        throw new RuntimeException("Desde 'En Preparación' solo se puede pasar a 'En Camino' o 'Cancelado'");
                    }
                }
                break;
            case LISTO_PARA_RECOGER:
                if (nuevo != EstadoPedido.ENTREGADO) {
                    throw new RuntimeException("Desde 'Listo para Recoger' solo se puede pasar a 'Entregado'");
                }
                break;
            case EN_CAMINO:
                if (nuevo != EstadoPedido.ENTREGADO) {
                    throw new RuntimeException("Desde 'En Camino' solo se puede pasar a 'Entregado'");
                }
                break;
        }
    }

    private String guardarComprobanteTemp(MultipartFile archivo, String timestamp) {
        try {
            if (!Files.exists(comprobantesPath)) {
                Files.createDirectories(comprobantesPath);
            }

            String extension = obtenerExtension(archivo.getOriginalFilename());
            String nombreArchivo = "comprobante_" + timestamp + extension;

            Path destino = comprobantesPath.resolve(nombreArchivo);
            Files.copy(archivo.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);

            return "/comprobantes/" + nombreArchivo;

        } catch (IOException e) {
            throw new RuntimeException("Error al guardar comprobante: " + e.getMessage());
        }
    }

    private String obtenerExtension(String nombreArchivo) {
        if (nombreArchivo != null && nombreArchivo.contains(".")) {
            return nombreArchivo.substring(nombreArchivo.lastIndexOf("."));
        }
        return ".jpg";
    }
}