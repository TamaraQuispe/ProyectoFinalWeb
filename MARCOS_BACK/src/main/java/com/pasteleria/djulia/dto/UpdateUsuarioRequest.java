package com.pasteleria.djulia.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateUsuarioRequest {

    @Size(min = 2, max = 50, message = "El nombre debe tener entre 2 y 50 caracteres")
    private String nombre;

    @Size(min = 2, max = 50, message = "El apellido debe tener entre 2 y 50 caracteres")
    private String apellido;

    @Pattern(regexp = "^[0-9]{9}$", message = "El celular debe tener 9 dígitos")
    private String celular;

    @Email(message = "El correo debe ser válido")
    private String correo;

    @Size(min = 5, max = 200, message = "La dirección debe tener entre 5 y 200 caracteres")
    private String direccion;

    @Pattern(regexp = "^[0-9]{8}$", message = "El DNI debe tener 8 dígitos")
    private String dni;

    @Size(min = 6, max = 100, message = "La contraseña debe tener al menos 6 caracteres")
    private String password;
}