package com.pasteleria.djulia.controller;

import com.pasteleria.djulia.dto.ApiResponse;
import com.pasteleria.djulia.model.EstadoPedido;
import com.pasteleria.djulia.model.Pedido;
import com.pasteleria.djulia.model.Usuario;
import com.pasteleria.djulia.repository.UsuarioRepository;
import com.pasteleria.djulia.service.BoletaService;
import com.pasteleria.djulia.service.PedidoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/boletas")
@RequiredArgsConstructor
public class BoletaController {

    private final BoletaService boletaService;
    private final PedidoService pedidoService;
    private final UsuarioRepository usuarioRepository;

    @GetMapping("/pedido/{pedidoId}/descargar")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<byte[]> descargarBoleta(@PathVariable Long pedidoId) {
        Usuario cliente = obtenerUsuarioAutenticado();
        Pedido pedido = validarPedidoCliente(pedidoId, cliente);
        return generarRespuestaPDF(pedido, false);
    }

    @GetMapping("/pedido/{pedidoId}/ver")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<byte[]> verBoleta(@PathVariable Long pedidoId) {
        Usuario cliente = obtenerUsuarioAutenticado();
        Pedido pedido = validarPedidoCliente(pedidoId, cliente);
        return generarRespuestaPDF(pedido, true);
    }

    @GetMapping("/pedido/{pedidoId}/disponibilidad")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<ApiResponse> verificarDisponibilidad(@PathVariable Long pedidoId) {
        Usuario cliente = obtenerUsuarioAutenticado();
        Pedido pedido = validarPedidoCliente(pedidoId, cliente);

        boolean disponible = pedido.getEstado() == EstadoPedido.ENTREGADO;

        Map<String, Object> data = new HashMap<>();
        data.put("disponible", disponible);
        data.put("estado", pedido.getEstado());
        data.put("pedidoId", pedido.getId());
        data.put("numeroBoleta", String.format("%08d", pedido.getId()));
        data.put("mensaje", disponible
                ? "Boleta disponible para descargar"
                : "La boleta estará disponible cuando el pedido sea entregado");

        return ResponseEntity.ok(new ApiResponse(true, "Estado de disponibilidad de boleta", data));
    }

    @GetMapping("/admin/pedido/{pedidoId}/descargar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<byte[]> descargarBoletaAdmin(@PathVariable Long pedidoId) {
        Pedido pedido = validarPedidoEntregado(pedidoId);
        return generarRespuestaPDF(pedido, false);
    }

    @GetMapping("/admin/pedido/{pedidoId}/ver")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<byte[]> verBoletaAdmin(@PathVariable Long pedidoId) {
        Pedido pedido = validarPedidoEntregado(pedidoId);
        return generarRespuestaPDF(pedido, true);
    }

    private Usuario obtenerUsuarioAutenticado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String correo = authentication.getName();
        return usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    private Pedido validarPedidoCliente(Long pedidoId, Usuario cliente) {
        Pedido pedido = pedidoService.buscarPorId(pedidoId);
        if (!pedido.getUsuario().getId().equals(cliente.getId())) {
            throw new RuntimeException("No tienes permiso para acceder a este pedido");
        }
        return validarPedidoEntregado(pedidoId);
    }

    private Pedido validarPedidoEntregado(Long pedidoId) {
        Pedido pedido = pedidoService.buscarPorId(pedidoId);
        if (pedido.getEstado() != EstadoPedido.ENTREGADO) {
            throw new RuntimeException("Solo se puede acceder a boletas de pedidos entregados");
        }
        return pedido;
    }

    private ResponseEntity<byte[]> generarRespuestaPDF(Pedido pedido, boolean inline) {
        try {
            byte[] pdfBytes = boletaService.generarBoleta(pedido);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);

            headers.setContentDisposition(
                    ContentDisposition.builder(inline ? "inline" : "attachment")
                            .filename("Boleta_" + String.format("%08d", pedido.getId()) + ".pdf")
                            .build()
            );

            headers.setContentLength(pdfBytes.length);

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);

        } catch (Exception e) {
            throw new RuntimeException("Error al generar la boleta: " + e.getMessage());
        }
    }
}