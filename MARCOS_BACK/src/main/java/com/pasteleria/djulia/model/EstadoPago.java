package com.pasteleria.djulia.model;

import lombok.Getter;

@Getter
public enum EstadoPago {
    PENDIENTE_VERIFICACION("Pendiente de Verificación"),
    VERIFICADO("Verificado"),
    RECHAZADO("Rechazado");

    private final String descripcion;

    EstadoPago(String descripcion) {
        this.descripcion = descripcion;
    }
}