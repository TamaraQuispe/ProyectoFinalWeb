package com.pasteleria.djulia.service;

import com.pasteleria.djulia.dto.ApiResponse;
import com.pasteleria.djulia.dto.LoginRequest;
import com.pasteleria.djulia.dto.RegisterRequest;
import com.pasteleria.djulia.model.Role;
import com.pasteleria.djulia.model.Usuario;
import com.pasteleria.djulia.repository.UsuarioRepository;
import com.pasteleria.djulia.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    public ApiResponse login(LoginRequest request, Role expectedRole) {
        Usuario usuario = usuarioRepository.findByCorreo(request.getCorreo())
                .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));

        if (!usuario.getRole().equals(expectedRole)) {
            throw new RuntimeException("No tienes permisos para acceder a este tipo de login");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getCorreo(),
                        request.getPassword()
                )
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getCorreo());
        String token = jwtService.generateToken(userDetails);

        Map<String, Object> loginData = new HashMap<>();
        loginData.put("token", token);
        loginData.put("role", usuario.getRole());

        return new ApiResponse(true, "Login exitoso", loginData);
    }

    public ApiResponse register(RegisterRequest request, Role role) {
        if (usuarioRepository.existsByCorreo(request.getCorreo())) {
            throw new RuntimeException("El correo ya está registrado");
        }

        if (usuarioRepository.existsByDni(request.getDni())) {
            throw new RuntimeException("El DNI ya está registrado");
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre());
        usuario.setApellido(request.getApellido());
        usuario.setCelular(request.getCelular());
        usuario.setCorreo(request.getCorreo());
        usuario.setDireccion(request.getDireccion());
        usuario.setDni(request.getDni());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setRole(role);

        usuarioRepository.save(usuario);

        return new ApiResponse(true, "Usuario registrado exitosamente", null);
    }
}