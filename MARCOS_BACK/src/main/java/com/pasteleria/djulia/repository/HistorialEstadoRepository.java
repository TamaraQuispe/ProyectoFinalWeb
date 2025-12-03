package com.pasteleria.djulia.repository;

import com.pasteleria.djulia.model.HistorialEstado;
import com.pasteleria.djulia.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HistorialEstadoRepository extends JpaRepository<HistorialEstado, Long> {
    List<HistorialEstado> findByPedidoOrderByFechaCambioDesc(Pedido pedido);
}