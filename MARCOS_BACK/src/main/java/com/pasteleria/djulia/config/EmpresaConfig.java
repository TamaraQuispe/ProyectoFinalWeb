package com.pasteleria.djulia.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import lombok.Data;

@Data
@Configuration
@ConfigurationProperties(prefix = "empresa")
public class EmpresaConfig {
    private String nombre;
    private String ruc;
    private String direccion;
    private String telefono;
    private String email;
    private String logoPath; // Ruta del logo en resources
}