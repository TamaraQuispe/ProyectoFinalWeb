package com.pasteleria.djulia.repository;

import com.pasteleria.djulia.model.EstadoPedido;
import com.pasteleria.djulia.model.Pedido;
import com.pasteleria.djulia.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    List<Pedido> findAllByOrderByFechaPedidoDesc();
    List<Pedido> findByUsuarioOrderByFechaPedidoDesc(Usuario usuario);
    List<Pedido> findByEstadoOrderByFechaPedidoDesc(EstadoPedido estado);

    @Query("SELECT SUM(p.total) FROM Pedido p WHERE p.estado IN :estados")
    Double sumTotalByEstados(@Param("estados") List<EstadoPedido> estados);

    @Query("SELECT pr.nombre, SUM(dp.cantidad) " +
            "FROM Pedido p " +
            "JOIN p.detalles dp " +
            "JOIN dp.producto pr " +
            "WHERE p.estado IN :estados " +
            "GROUP BY pr.id, pr.nombre " +
            "ORDER BY SUM(dp.cantidad) DESC")
    List<Object[]> findProductosMasVendidos(@Param("estados") List<EstadoPedido> estados);

    @Query("SELECT c.nombre, SUM(dp.cantidad) " +
            "FROM Pedido p " +
            "JOIN p.detalles dp " +
            "JOIN dp.producto pr " +
            "JOIN pr.categoria c " +
            "WHERE p.estado IN :estados " +
            "GROUP BY c.id, c.nombre " +
            "ORDER BY SUM(dp.cantidad) DESC")
    List<Object[]> findCantidadVendidaPorCategoria(@Param("estados") List<EstadoPedido> estados);

    @Query("SELECT p.estado, COUNT(p) FROM Pedido p GROUP BY p.estado")
    List<Object[]> countPedidosByEstado();

    List<Pedido> findTop4ByOrderByFechaPedidoDesc();
}