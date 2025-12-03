package com.pasteleria.djulia.controller;

import com.pasteleria.djulia.dto.ApiResponse;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api")
public class ArchivosController {

    private final Path rootProductos = Paths.get("src/main/resources/static/productos");
    private final Path rootComprobantes = Paths.get("src/main/resources/static/comprobantes");

    @GetMapping("/archivos/{categoria}/{archivo}")
    public ResponseEntity<?> obtenerArchivoProducto(
            @PathVariable String categoria,
            @PathVariable String archivo) {

        try {
            Path file = rootProductos.resolve(categoria).resolve(archivo);
            Resource resource = new UrlResource(file.toUri());

            if (!resource.exists()) {
                return ResponseEntity
                        .status(404)
                        .body(new ApiResponse(false,
                                "El archivo no existe",
                                null));
            }

            String contentType = Files.probeContentType(file);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + archivo + "\"")
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity
                    .status(400)
                    .body(new ApiResponse(false,
                            "Error cargando archivo: " + e.getMessage(),
                            null));
        }
    }

    @GetMapping("/comprobantes/{archivo}")
    public ResponseEntity<?> obtenerComprobante(
            @PathVariable String archivo) {

        try {
            Path file = rootComprobantes.resolve(archivo);
            Resource resource = new UrlResource(file.toUri());

            if (!resource.exists()) {
                return ResponseEntity
                        .status(404)
                        .body(new ApiResponse(false,
                                "El comprobante no existe",
                                null));
            }

            String contentType = Files.probeContentType(file);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + archivo + "\"")
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity
                    .status(400)
                    .body(new ApiResponse(false,
                            "Error cargando comprobante: " + e.getMessage(),
                            null));
        }
    }
}