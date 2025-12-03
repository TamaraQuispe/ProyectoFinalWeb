package com.pasteleria.djulia.service;

import com.pasteleria.djulia.dto.EstadoPedidoDTO;
import com.pasteleria.djulia.dto.PedidoRecienteDTO;
import com.pasteleria.djulia.dto.ProductoMasVendidoDTO;
import com.pasteleria.djulia.dto.VentasPorCategoriaDTO;
import com.pasteleria.djulia.model.EstadoPedido;
import com.pasteleria.djulia.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;
    private final PedidoRepository pedidoRepository;

    public Map<String, Object> obtenerEstadisticasGenerales() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalUsuarios", usuarioRepository.count());
        stats.put("totalProductos", productoRepository.count());
        stats.put("totalPedidos", pedidoRepository.count());

        List<EstadoPedido> estadosValidos = Arrays.asList(
                EstadoPedido.CONFIRMADO,
                EstadoPedido.EN_PREPARACION,
                EstadoPedido.LISTO_PARA_RECOGER,
                EstadoPedido.EN_CAMINO,
                EstadoPedido.ENTREGADO
        );

        Double totalVentas = pedidoRepository.sumTotalByEstados(estadosValidos);
        stats.put("totalVentas", totalVentas != null ? totalVentas : 0.0);

        return stats;
    }

    public List<ProductoMasVendidoDTO> obtenerProductosMasVendidos() {
        List<EstadoPedido> estadosValidos = Arrays.asList(
                EstadoPedido.CONFIRMADO,
                EstadoPedido.EN_PREPARACION,
                EstadoPedido.LISTO_PARA_RECOGER,
                EstadoPedido.EN_CAMINO,
                EstadoPedido.ENTREGADO
        );

        List<Object[]> resultados = pedidoRepository.findProductosMasVendidos(estadosValidos);

        return resultados.stream()
                .limit(5)
                .map(r -> new ProductoMasVendidoDTO(
                        (String) r[0],
                        ((Number) r[1]).intValue()
                ))
                .collect(Collectors.toList());
    }

    public List<VentasPorCategoriaDTO> obtenerVentasPorCategoria() {
        List<EstadoPedido> estadosValidos = Arrays.asList(
                EstadoPedido.CONFIRMADO,
                EstadoPedido.EN_PREPARACION,
                EstadoPedido.LISTO_PARA_RECOGER,
                EstadoPedido.EN_CAMINO,
                EstadoPedido.ENTREGADO
        );

        List<Object[]> resultados = pedidoRepository.findCantidadVendidaPorCategoria(estadosValidos);

        return resultados.stream()
                .map(r -> new VentasPorCategoriaDTO(
                        (String) r[0],
                        ((Number) r[1]).intValue()
                ))
                .collect(Collectors.toList());
    }

    public List<EstadoPedidoDTO> obtenerEstadoPedidos() {
        List<Object[]> resultados = pedidoRepository.countPedidosByEstado();

        return resultados.stream()
                .map(r -> new EstadoPedidoDTO(
                        ((EstadoPedido) r[0]).getDescripcion(),
                        ((Long) r[1]).intValue()
                ))
                .collect(Collectors.toList());
    }

    public List<PedidoRecienteDTO> obtenerPedidosRecientes(int limit) {
        return pedidoRepository.findTop4ByOrderByFechaPedidoDesc()
                .stream()
                .limit(limit)
                .map(pedido -> new PedidoRecienteDTO(
                        pedido.getId(),
                        pedido.getUsuario().getNombre() + " " + pedido.getUsuario().getApellido(),
                        pedido.getTotal(),
                        pedido.getEstado()
                ))
                .collect(Collectors.toList());
    }
}