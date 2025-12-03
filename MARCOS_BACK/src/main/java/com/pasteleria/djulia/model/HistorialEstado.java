package com.pasteleria.djulia.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "historial_estado")
public class HistorialEstado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "pedido_id", nullable = false)
    @JsonIgnore
    private Pedido pedido;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoPedido estadoAnterior;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoPedido estadoNuevo;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    @JsonIgnoreProperties({"pedidos", "password", "historialEstados"})
    private Usuario usuarioCambio; // Quién realizó el cambio

    @Column(length = 500)
    private String observacion;

    @Column(nullable = false)
    private LocalDateTime fechaCambio;

    @PrePersist
    protected void onCreate() {
        fechaCambio = LocalDateTime.now();
    }
}