package com.pasteleria.djulia.controller;

import com.pasteleria.djulia.dto.ApiResponse;
import com.pasteleria.djulia.dto.LoginRequest;
import com.pasteleria.djulia.dto.RegisterRequest;
import com.pasteleria.djulia.dto.UpdateUsuarioRequest;
import com.pasteleria.djulia.model.Role;
import com.pasteleria.djulia.model.Usuario;
import com.pasteleria.djulia.repository.UsuarioRepository;
import com.pasteleria.djulia.service.AuthService;
import com.pasteleria.djulia.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UsuarioRepository usuarioRepository;
    private final UsuarioService usuarioService;

    @PostMapping("/{role}/login")
    public ResponseEntity<ApiResponse> login(@PathVariable String role, @Valid @RequestBody LoginRequest request) {
        Role userRole = Role.valueOf(role.toUpperCase());
        return ResponseEntity.ok(authService.login(request, userRole));
    }

    @PostMapping("/{role}/register")
    public ResponseEntity<ApiResponse> register(@PathVariable String role, @Valid @RequestBody RegisterRequest request) {
        Role userRole = Role.valueOf(role.toUpperCase());
        if (userRole != Role.CLIENTE) {
            return ResponseEntity.status(403).body(new ApiResponse(false, "Acceso denegado", null));
        }
        return ResponseEntity.ok(authService.register(request, userRole));
    }

    @PostMapping("/admin/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> registerAdmin(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request, Role.ADMIN));
    }

    @PostMapping("/vendedor/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> registerVendedor(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request, Role.VENDEDOR));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse> obtenerPerfil() {
        Usuario usuario = getUsuarioAutenticado();
        return ResponseEntity.ok(new ApiResponse(true, "Perfil obtenido correctamente", mapUsuario(usuario)));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse> actualizarPerfil(@Valid @RequestBody UpdateUsuarioRequest request) {
        Usuario usuario = getUsuarioAutenticado();
        Usuario usuarioActualizado = usuarioService.actualizar(usuario.getId(), request);
        return ResponseEntity.ok(new ApiResponse(true, "Perfil actualizado correctamente", mapUsuario(usuarioActualizado)));
    }

    private Usuario getUsuarioAutenticado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String correo = authentication.getName();
        return usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    private Map<String, Object> mapUsuario(Usuario usuario) {
        Map<String, Object> userData = new HashMap<>();
        userData.put("id", usuario.getId());
        userData.put("nombre", usuario.getNombre());
        userData.put("apellido", usuario.getApellido());
        userData.put("correo", usuario.getCorreo());
        userData.put("celular", usuario.getCelular());
        userData.put("direccion", usuario.getDireccion());
        userData.put("dni", usuario.getDni());
        userData.put("role", usuario.getRole());
        return userData;
    }
}