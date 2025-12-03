package com.pasteleria.djulia.model;

import lombok.Getter;

@Getter
public enum EstadoPedido {
    POR_CONFIRMAR("Por Confirmar"),
    CONFIRMADO("Confirmado"),
    EN_PREPARACION("En Preparación"),
    LISTO_PARA_RECOGER("Listo para Recoger"),
    EN_CAMINO("En Camino"),
    ENTREGADO("Entregado"),
    CANCELADO("Cancelado");

    private final String descripcion;

    EstadoPedido(String descripcion) {
        this.descripcion = descripcion;
    }
}