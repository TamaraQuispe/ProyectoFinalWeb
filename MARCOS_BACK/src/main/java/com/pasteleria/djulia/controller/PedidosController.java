package com.pasteleria.djulia.controller;

import com.pasteleria.djulia.dto.*;
import com.pasteleria.djulia.model.EstadoPedido;
import com.pasteleria.djulia.model.HistorialEstado;
import com.pasteleria.djulia.model.Pedido;
import com.pasteleria.djulia.model.Usuario;
import com.pasteleria.djulia.repository.UsuarioRepository;
import com.pasteleria.djulia.service.PedidoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PedidosController {

    private final PedidoService pedidoService;
    private final UsuarioRepository usuarioRepository;

    @PostMapping("/cliente/pedidos")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<ApiResponse> crearPedido(
            @RequestParam("pedido") String pedidoJson,
            @RequestParam("comprobanteYape") MultipartFile comprobanteYape) {

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            PedidoRequest request = objectMapper.readValue(pedidoJson, PedidoRequest.class);

            Usuario cliente = obtenerUsuarioAutenticado();
            Pedido pedido = pedidoService.crearPedido(request, comprobanteYape, cliente);

            return ResponseEntity.ok(
                    new ApiResponse(true, "Pedido creado exitosamente. Esperando verificación de pago", pedido)
            );
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ApiResponse(false, "Error al crear pedido: " + e.getMessage(), null));
        }
    }

    @GetMapping("/cliente/pedidos")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<ApiResponse> misPedidos() {
        Usuario cliente = obtenerUsuarioAutenticado();
        List<Pedido> pedidos = pedidoService.listarPorCliente(cliente);
        return ResponseEntity.ok(
                new ApiResponse(true, "Pedidos del cliente listados correctamente", pedidos)
        );
    }

    @GetMapping("/cliente/pedidos/{id}")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<ApiResponse> verMiPedido(@PathVariable Long id) {
        Usuario cliente = obtenerUsuarioAutenticado();
        Pedido pedido = pedidoService.buscarPorId(id);

        if (!pedido.getUsuario().getId().equals(cliente.getId())) {
            throw new RuntimeException("No tienes permiso para ver este pedido");
        }

        return ResponseEntity.ok(
                new ApiResponse(true, "Pedido encontrado", pedido)
        );
    }

    @GetMapping("/cliente/pedidos/{id}/historial")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<ApiResponse> verHistorialMiPedido(@PathVariable Long id) {
        Usuario cliente = obtenerUsuarioAutenticado();
        Pedido pedido = pedidoService.buscarPorId(id);

        if (!pedido.getUsuario().getId().equals(cliente.getId())) {
            throw new RuntimeException("No tienes permiso para ver este pedido");
        }

        List<HistorialEstado> historial = pedidoService.obtenerHistorial(id);
        return ResponseEntity.ok(
                new ApiResponse(true, "Historial del pedido", historial)
        );
    }

    @PutMapping("/cliente/pedidos/{id}/cancelar")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<ApiResponse> cancelarMiPedido(@PathVariable Long id) {
        Usuario cliente = obtenerUsuarioAutenticado();
        Pedido pedido = pedidoService.buscarPorId(id);

        if (!pedido.getUsuario().getId().equals(cliente.getId())) {
            throw new RuntimeException("No tienes permiso para cancelar este pedido");
        }

        if (pedido.getEstado() != EstadoPedido.POR_CONFIRMAR) {
            throw new RuntimeException("Solo puedes cancelar pedidos que están 'Por Confirmar'");
        }

        CambiarEstadoRequest request = new CambiarEstadoRequest();
        request.setNuevoEstado(EstadoPedido.CANCELADO);
        request.setObservacion("Cancelado por el cliente");

        Pedido pedidoActualizado = pedidoService.cambiarEstado(id, request, cliente);
        return ResponseEntity.ok(
                new ApiResponse(true, "Pedido cancelado correctamente", pedidoActualizado)
        );
    }

    @GetMapping("/vendedor/pedidos")
    @PreAuthorize("hasRole('VENDEDOR')")
    public ResponseEntity<ApiResponse> listarPedidos() {
        List<Pedido> pedidos = pedidoService.listarTodos();
        return ResponseEntity.ok(
                new ApiResponse(true, "Pedidos listados correctamente", pedidos)
        );
    }

    @GetMapping("/vendedor/pedidos/estado/{estado}")
    @PreAuthorize("hasRole('VENDEDOR')")
    public ResponseEntity<ApiResponse> listarPorEstado(@PathVariable EstadoPedido estado) {
        List<Pedido> pedidos = pedidoService.listarPorEstado(estado);
        return ResponseEntity.ok(
                new ApiResponse(true, "Pedidos con estado " + estado.getDescripcion(), pedidos)
        );
    }

    @GetMapping("/vendedor/pedidos/{id}")
    @PreAuthorize("hasRole('VENDEDOR')")
    public ResponseEntity<ApiResponse> verPedido(@PathVariable Long id) {
        Pedido pedido = pedidoService.buscarPorId(id);
        return ResponseEntity.ok(
                new ApiResponse(true, "Pedido encontrado", pedido)
        );
    }

    @PutMapping("/vendedor/pedidos/{id}/verificar-pago")
    @PreAuthorize("hasRole('VENDEDOR')")
    public ResponseEntity<ApiResponse> verificarPago(@PathVariable Long id) {
        Usuario vendedor = obtenerUsuarioAutenticado();
        Pedido pedido = pedidoService.verificarPago(id, vendedor);

        return ResponseEntity.ok(
                new ApiResponse(true, "Pago verificado. Ahora puedes confirmar el pedido", pedido)
        );
    }

    @PutMapping("/vendedor/pedidos/{id}/rechazar-pago")
    @PreAuthorize("hasRole('VENDEDOR')")
    public ResponseEntity<ApiResponse> rechazarPago(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        Usuario vendedor = obtenerUsuarioAutenticado();
        String motivo = body.get("motivo");

        if (motivo == null || motivo.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Debe especificar el motivo del rechazo", null));
        }

        Pedido pedido = pedidoService.rechazarPago(id, motivo, vendedor);

        return ResponseEntity.ok(
                new ApiResponse(true, "Pago rechazado. Pedido cancelado automáticamente", pedido)
        );
    }

    @PutMapping("/vendedor/pedidos/{id}/estado")
    @PreAuthorize("hasRole('VENDEDOR')")
    public ResponseEntity<ApiResponse> cambiarEstado(
            @PathVariable Long id,
            @Valid @RequestBody CambiarEstadoRequest request) {

        Usuario vendedor = obtenerUsuarioAutenticado();
        Pedido pedido = pedidoService.cambiarEstado(id, request, vendedor);

        return ResponseEntity.ok(
                new ApiResponse(true, "Estado del pedido actualizado correctamente", pedido)
        );
    }

    @GetMapping("/vendedor/pedidos/{id}/historial")
    @PreAuthorize("hasRole('VENDEDOR')")
    public ResponseEntity<ApiResponse> verHistorial(@PathVariable Long id) {
        List<HistorialEstado> historial = pedidoService.obtenerHistorial(id);
        return ResponseEntity.ok(
                new ApiResponse(true, "Historial del pedido", historial)
        );
    }

    @GetMapping("/admin/pedidos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> listarTodosPedidosAdmin() {
        List<Pedido> pedidos = pedidoService.listarTodos();
        return ResponseEntity.ok(
                new ApiResponse(true, "Todos los pedidos", pedidos)
        );
    }

    @GetMapping("/admin/pedidos/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> verPedidoAdmin(@PathVariable Long id) {
        Pedido pedido = pedidoService.buscarPorId(id);
        return ResponseEntity.ok(
                new ApiResponse(true, "Detalle del pedido", pedido)
        );
    }

    @GetMapping("/admin/pedidos/{id}/historial")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> verHistorialAdmin(@PathVariable Long id) {
        List<HistorialEstado> historial = pedidoService.obtenerHistorial(id);
        return ResponseEntity.ok(
                new ApiResponse(true, "Historial del pedido", historial)
        );
    }

    @GetMapping("/admin/pedidos/estado/{estado}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> listarPorEstadoAdmin(@PathVariable EstadoPedido estado) {
        List<Pedido> pedidos = pedidoService.listarPorEstado(estado);
        return ResponseEntity.ok(
                new ApiResponse(true, "Pedidos con estado " + estado.getDescripcion(), pedidos)
        );
    }

    @PutMapping("/admin/pedidos/{id}/verificar-pago")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> verificarPagoAdmin(@PathVariable Long id) {
        Usuario admin = obtenerUsuarioAutenticado();
        Pedido pedido = pedidoService.verificarPago(id, admin);

        return ResponseEntity.ok(
                new ApiResponse(true, "Pago verificado correctamente", pedido)
        );
    }

    @PutMapping("/admin/pedidos/{id}/rechazar-pago")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> rechazarPagoAdmin(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        Usuario admin = obtenerUsuarioAutenticado();
        String motivo = body.get("motivo");

        if (motivo == null || motivo.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Debe especificar el motivo del rechazo", null));
        }

        Pedido pedido = pedidoService.rechazarPago(id, motivo, admin);

        return ResponseEntity.ok(
                new ApiResponse(true, "Pago rechazado. Pedido cancelado", pedido)
        );
    }

    @PutMapping("/admin/pedidos/{id}/estado")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> cambiarEstadoAdmin(
            @PathVariable Long id,
            @Valid @RequestBody CambiarEstadoRequest request) {

        Usuario admin = obtenerUsuarioAutenticado();
        Pedido pedido = pedidoService.cambiarEstado(id, request, admin);

        return ResponseEntity.ok(
                new ApiResponse(true, "Estado del pedido actualizado", pedido)
        );
    }

    private Usuario obtenerUsuarioAutenticado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String correo = authentication.getName();
        return usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
}