package com.pasteleria.djulia.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String apellido;
    private String celular;

    @Column(unique = true)
    private String correo;

    private String direccion;

    @Column(unique = true)
    private String dni;

    @JsonIgnore
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;
}