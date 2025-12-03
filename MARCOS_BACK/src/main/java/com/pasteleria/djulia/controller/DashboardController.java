package com.pasteleria.djulia.controller;

import com.pasteleria.djulia.dto.ApiResponse;
import com.pasteleria.djulia.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/estadisticas-generales")
    public ApiResponse obtenerEstadisticasGenerales() {
        Map<String, Object> stats = dashboardService.obtenerEstadisticasGenerales();
        return new ApiResponse(true, "Estadísticas obtenidas exitosamente", stats);
    }

    @GetMapping("/productos-mas-vendidos")
    public ApiResponse obtenerProductosMasVendidos() {
        return new ApiResponse(true, "Productos más vendidos obtenidos",
                dashboardService.obtenerProductosMasVendidos());
    }

    @GetMapping("/ventas-por-categoria")
    public ApiResponse obtenerVentasPorCategoria() {
        return new ApiResponse(true, "Ventas por categoría obtenidas",
                dashboardService.obtenerVentasPorCategoria());
    }

    @GetMapping("/estado-pedidos")
    public ApiResponse obtenerEstadoPedidos() {
        return new ApiResponse(true, "Estado de pedidos obtenido",
                dashboardService.obtenerEstadoPedidos());
    }

    @GetMapping("/pedidos-recientes")
    public ApiResponse obtenerPedidosRecientes(@RequestParam(defaultValue = "4") int limit) {
        return new ApiResponse(true, "Pedidos recientes obtenidos",
                dashboardService.obtenerPedidosRecientes(limit));
    }
}