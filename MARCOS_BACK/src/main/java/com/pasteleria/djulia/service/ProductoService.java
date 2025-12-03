package com.pasteleria.djulia.service;

import com.pasteleria.djulia.dto.ProductoRequest;
import com.pasteleria.djulia.model.Categoria;
import com.pasteleria.djulia.model.Producto;
import com.pasteleria.djulia.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository repo;
    private final CategoriaService categoriaService;
    private final Path rootPath = Paths.get("src/main/resources/static/productos");

    public List<Producto> listar() {
        return repo.findAll();
    }

    public Producto buscarPorId(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
    }

    @Transactional
    public Producto crear(ProductoRequest request, MultipartFile imagen) {
        Categoria categoria = categoriaService.buscarPorId(request.getCategoriaId());

        Producto producto = new Producto();
        producto.setNombre(request.getNombre());
        producto.setDescripcion(request.getDescripcion());
        producto.setPrecio(request.getPrecio());
        producto.setStock(request.getStock());
        producto.setCategoria(categoria);

        if (imagen != null && !imagen.isEmpty()) {
            String rutaImagen = guardarImagen(imagen, categoria.getNombre(), request.getNombre());
            producto.setImagen(rutaImagen);
        }

        return repo.save(producto);
    }

    @Transactional
    public Producto actualizar(Long id, ProductoRequest request, MultipartFile imagen) {
        Producto producto = buscarPorId(id);
        Categoria nuevaCategoria = categoriaService.buscarPorId(request.getCategoriaId());

        producto.setNombre(request.getNombre());
        producto.setDescripcion(request.getDescripcion());
        producto.setPrecio(request.getPrecio());
        producto.setStock(request.getStock());

        if (!producto.getCategoria().getId().equals(nuevaCategoria.getId())) {
            if (producto.getImagen() != null) {
                moverImagen(producto.getImagen(), producto.getCategoria().getNombre(), nuevaCategoria.getNombre());
            }
            producto.setCategoria(nuevaCategoria);
        }

        if (imagen != null && !imagen.isEmpty()) {
            if (producto.getImagen() != null) {
                eliminarImagen(producto.getImagen());
            }
            String rutaImagen = guardarImagen(imagen, nuevaCategoria.getNombre(), request.getNombre());
            producto.setImagen(rutaImagen);
        }

        return repo.save(producto);
    }

    @Transactional
    public void eliminar(Long id) {
        Producto producto = buscarPorId(id);

        if (producto.getImagen() != null) {
            eliminarImagen(producto.getImagen());
        }

        repo.delete(producto);
    }

    private String guardarImagen(MultipartFile archivo, String nombreCategoria, String nombreProducto) {
        try {
            Path categoriaPath = rootPath.resolve(nombreCategoria.toLowerCase());
            if (!Files.exists(categoriaPath)) {
                Files.createDirectories(categoriaPath);
            }

            String extension = obtenerExtension(archivo.getOriginalFilename());
            String nombreArchivo = nombreProducto.toLowerCase()
                    .replaceAll("\\s+", "_")
                    .replaceAll("[^a-z0-9_]", "") + extension;

            Path destino = categoriaPath.resolve(nombreArchivo);
            Files.copy(archivo.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);

            return "/archivos/" + nombreCategoria.toLowerCase() + "/" + nombreArchivo;

        } catch (IOException e) {
            throw new RuntimeException("Error al guardar imagen: " + e.getMessage());
        }
    }

    private void eliminarImagen(String rutaImagen) {
        try {
            String[] partes = rutaImagen.split("/archivos/");
            if (partes.length == 2) {
                Path archivo = rootPath.resolve(partes[1]);
                Files.deleteIfExists(archivo);
            }
        } catch (IOException e) {
            throw new RuntimeException("Error al eliminar imagen: " + e.getMessage());
        }
    }

    private void moverImagen(String rutaImagen, String categoriaAnterior, String nuevaCategoria) {
        try {
            String[] partes = rutaImagen.split("/");
            String nombreArchivo = partes[partes.length - 1];

            Path origen = rootPath.resolve(categoriaAnterior.toLowerCase()).resolve(nombreArchivo);
            Path destino = rootPath.resolve(nuevaCategoria.toLowerCase()).resolve(nombreArchivo);

            if (Files.exists(origen)) {
                Files.createDirectories(destino.getParent());
                Files.move(origen, destino, StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (IOException e) {
            throw new RuntimeException("Error al mover imagen: " + e.getMessage());
        }
    }

    private String obtenerExtension(String nombreArchivo) {
        if (nombreArchivo != null && nombreArchivo.contains(".")) {
            return nombreArchivo.substring(nombreArchivo.lastIndexOf("."));
        }
        return ".jpg";
    }
}