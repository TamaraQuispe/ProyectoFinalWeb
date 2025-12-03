package com.pasteleria.djulia.controller;

import com.pasteleria.djulia.dto.ApiResponse;
import com.pasteleria.djulia.dto.CategoriaRequest;
import com.pasteleria.djulia.dto.ProductoRequest;
import com.pasteleria.djulia.model.Categoria;
import com.pasteleria.djulia.model.Producto;
import com.pasteleria.djulia.service.CategoriaService;
import com.pasteleria.djulia.service.ProductoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProductosController {

    private final ProductoService productoService;
    private final CategoriaService categoriaService;

    @GetMapping("/categorias")
    public ResponseEntity<ApiResponse> listarCategorias() {
        List<Categoria> list = categoriaService.listar();
        return ResponseEntity.ok(
                new ApiResponse(true, "Categorías listadas correctamente", list)
        );
    }

    @GetMapping("/productos")
    public ResponseEntity<ApiResponse> listarProductos() {
        List<Producto> list = productoService.listar();
        return ResponseEntity.ok(
                new ApiResponse(true, "Productos listados correctamente", list)
        );
    }

    @PostMapping("/admin/categorias")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> crearCategoria(@Valid @RequestBody CategoriaRequest request) {
        Categoria categoria = categoriaService.crear(request);
        return ResponseEntity.ok(
                new ApiResponse(true, "Categoría creada correctamente", categoria)
        );
    }

    @PutMapping("/admin/categorias/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> actualizarCategoria(
            @PathVariable Long id,
            @Valid @RequestBody CategoriaRequest request
    ) {
        Categoria categoria = categoriaService.actualizar(id, request);
        return ResponseEntity.ok(
                new ApiResponse(true, "Categoría actualizada correctamente", categoria)
        );
    }

    @DeleteMapping("/admin/categorias/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> eliminarCategoria(@PathVariable Long id) {
        categoriaService.eliminar(id);
        return ResponseEntity.ok(
                new ApiResponse(true, "Categoría eliminada correctamente", null)
        );
    }

    @PostMapping("/admin/productos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> crearProducto(
            @Valid @ModelAttribute ProductoRequest request,
            @RequestParam(value = "imagen", required = false) MultipartFile imagen
    ) {
        Producto producto = productoService.crear(request, imagen);
        return ResponseEntity.ok(
                new ApiResponse(true, "Producto creado correctamente", producto)
        );
    }

    @PutMapping("/admin/productos/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> actualizarProducto(
            @PathVariable Long id,
            @Valid @ModelAttribute ProductoRequest request,
            @RequestParam(value = "imagen", required = false) MultipartFile imagen
    ) {
        Producto producto = productoService.actualizar(id, request, imagen);
        return ResponseEntity.ok(
                new ApiResponse(true, "Producto actualizado correctamente", producto)
        );
    }

    @DeleteMapping("/admin/productos/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> eliminarProducto(@PathVariable Long id) {
        productoService.eliminar(id);
        return ResponseEntity.ok(
                new ApiResponse(true, "Producto eliminado correctamente", null)
        );
    }
}