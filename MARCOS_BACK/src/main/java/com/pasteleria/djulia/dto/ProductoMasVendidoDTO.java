package com.pasteleria.djulia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProductoMasVendidoDTO {
    private String nombre;
    private Integer cantidadVendida;
}