package com.pasteleria.djulia.service;

import com.pasteleria.djulia.dto.UpdateUsuarioRequest;
import com.pasteleria.djulia.model.Usuario;
import com.pasteleria.djulia.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public List<Usuario> listar() {
        return usuarioRepository.findAll();
    }

    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
    }

    @Transactional
    public Usuario actualizar(Long id, UpdateUsuarioRequest request) {
        Usuario usuario = buscarPorId(id);

        if (request.getNombre() != null) {
            usuario.setNombre(request.getNombre());
        }
        if (request.getApellido() != null) {
            usuario.setApellido(request.getApellido());
        }
        if (request.getCelular() != null) {
            usuario.setCelular(request.getCelular());
        }
        if (request.getCorreo() != null) {
            if (!usuario.getCorreo().equals(request.getCorreo()) &&
                    usuarioRepository.existsByCorreo(request.getCorreo())) {
                throw new RuntimeException("El correo ya está en uso");
            }
            usuario.setCorreo(request.getCorreo());
        }
        if (request.getDireccion() != null) {
            usuario.setDireccion(request.getDireccion());
        }
        if (request.getDni() != null) {
            if (!usuario.getDni().equals(request.getDni()) &&
                    usuarioRepository.existsByDni(request.getDni())) {
                throw new RuntimeException("El DNI ya está en uso");
            }
            usuario.setDni(request.getDni());
        }
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return usuarioRepository.save(usuario);
    }

    @Transactional
    public void eliminar(Long id) {
        Usuario usuario = buscarPorId(id);
        usuarioRepository.delete(usuario);
    }
}