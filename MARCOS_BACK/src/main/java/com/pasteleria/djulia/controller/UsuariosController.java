package com.pasteleria.djulia.controller;

import com.pasteleria.djulia.dto.ApiResponse;
import com.pasteleria.djulia.dto.UpdateUsuarioRequest;
import com.pasteleria.djulia.model.Usuario;
import com.pasteleria.djulia.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/usuarios")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class UsuariosController {

    private final UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<ApiResponse> listarUsuarios() {
        List<Usuario> usuarios = usuarioService.listar();
        return ResponseEntity.ok(
                new ApiResponse(true, "Usuarios listados correctamente", usuarios)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> obtenerUsuarioPorId(@PathVariable Long id) {
        Usuario usuario = usuarioService.buscarPorId(id);
        return ResponseEntity.ok(
                new ApiResponse(true, "Usuario encontrado", usuario)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> actualizarUsuario(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUsuarioRequest request
    ) {
        Usuario usuarioActualizado = usuarioService.actualizar(id, request);
        return ResponseEntity.ok(
                new ApiResponse(true, "Usuario actualizado correctamente", usuarioActualizado)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> eliminarUsuario(@PathVariable Long id) {
        usuarioService.eliminar(id);
        return ResponseEntity.ok(
                new ApiResponse(true, "Usuario eliminado correctamente", null)
        );
    }
}