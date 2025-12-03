package com.pasteleria.djulia.model;

import lombok.Getter;

@Getter
public enum TipoEntrega {
    RECOJO_TIENDA("Recojo en Tienda"),
    DELIVERY("Delivery a Domicilio");

    private final String descripcion;

    TipoEntrega(String descripcion) {
        this.descripcion = descripcion;
    }
}