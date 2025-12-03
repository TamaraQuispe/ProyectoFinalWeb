package com.pasteleria.djulia.dto;

import com.pasteleria.djulia.model.EstadoPedido;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PedidoRecienteDTO {
    private Long id;
    private String cliente;
    private Double total;
    private EstadoPedido estado;
}