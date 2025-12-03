package com.pasteleria.djulia.dto;

import com.pasteleria.djulia.model.EstadoPedido;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CambiarEstadoRequest {

    @NotNull(message = "El nuevo estado es obligatorio")
    private EstadoPedido nuevoEstado;

    @Size(max = 500, message = "La observación no puede exceder 500 caracteres")
    private String observacion;
}