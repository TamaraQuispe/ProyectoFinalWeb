package com.pasteleria.djulia.repository;

import com.pasteleria.djulia.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
}