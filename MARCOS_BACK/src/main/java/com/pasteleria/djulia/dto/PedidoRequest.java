package com.pasteleria.djulia.dto;

import com.pasteleria.djulia.model.TipoEntrega;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class PedidoRequest {

    @NotEmpty(message = "Debe incluir al menos un producto")
    @Valid
    private List<DetallePedidoRequest> detalles;

    @NotNull(message = "El tipo de entrega es obligatorio")
    private TipoEntrega tipoEntrega;

    private String direccionEntrega;
    private String telefonoContacto;
    private String referencia;
    private String observaciones;

    @NotNull(message = "Debe subir el comprobante de pago")
    private String numeroYape;

}