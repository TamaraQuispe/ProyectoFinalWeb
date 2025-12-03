package com.pasteleria.djulia.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private LocalDateTime fechaPedido = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoPedido estado;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoEntrega tipoEntrega;

    private String direccionEntrega;
    private String telefonoContacto;
    private String referencia;
    private String observaciones;

    @Column(nullable = false)
    private Double total;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetallePedido> detalles = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoPago estadoPago = EstadoPago.PENDIENTE_VERIFICACION;

    @Column(nullable = false, length = 500)
    private String comprobanteYape;

    @Column(nullable = false)
    private String numeroYape;

    @Column(nullable = false)
    private LocalDateTime fechaSubidaComprobante;
}