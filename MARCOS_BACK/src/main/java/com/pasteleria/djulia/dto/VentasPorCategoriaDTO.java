package com.pasteleria.djulia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class VentasPorCategoriaDTO {
    private String nombre;
    private Integer cantidadVendida;
}