package com.pasteleria.djulia.service;

import com.pasteleria.djulia.dto.CategoriaRequest;
import com.pasteleria.djulia.model.Categoria;
import com.pasteleria.djulia.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository repo;
    private final Path rootPath = Paths.get("src/main/resources/static/productos");

    public List<Categoria> listar() {
        return repo.findAll();
    }

    public Categoria buscarPorId(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + id));
    }

    @Transactional
    public Categoria crear(CategoriaRequest request) {
        String nombreNormalizado = request.getNombre().trim();
        if (repo.existsByNombreIgnoreCase(nombreNormalizado)) {
            throw new RuntimeException("Ya existe una categoría con ese nombre");
        }

        Categoria categoria = new Categoria();
        categoria.setNombre(nombreNormalizado);

        Categoria categoriaSaved = repo.save(categoria);
        crearCarpetaCategoria(categoriaSaved.getNombre());

        return categoriaSaved;
    }

    @Transactional
    public Categoria actualizar(Long id, CategoriaRequest request) {
        Categoria categoria = buscarPorId(id);
        String nombreAnterior = categoria.getNombre();
        String nuevoNombre = request.getNombre().trim();

        if (!nombreAnterior.equalsIgnoreCase(nuevoNombre)) {
            if (repo.existsByNombreIgnoreCase(nuevoNombre)) {
                throw new RuntimeException("Ya existe una categoría con ese nombre");
            }
            renombrarCarpetaCategoria(nombreAnterior, nuevoNombre);
        }

        categoria.setNombre(nuevoNombre);
        return repo.save(categoria);
    }

    @Transactional
    public void eliminar(Long id) {
        Categoria categoria = buscarPorId(id);
        eliminarCarpetaCategoria(categoria.getNombre());
        repo.delete(categoria);
    }

    private void crearCarpetaCategoria(String nombreCategoria) {
        try {
            Path categoriaPath = rootPath.resolve(nombreCategoria.toLowerCase());
            if (!Files.exists(categoriaPath)) {
                Files.createDirectories(categoriaPath);
            }
        } catch (IOException e) {
            throw new RuntimeException("Error al crear carpeta para categoría: " + e.getMessage(), e);
        }
    }

    private void renombrarCarpetaCategoria(String nombreAnterior, String nuevoNombre) {
        try {
            Path carpetaAnterior = rootPath.resolve(nombreAnterior.toLowerCase());
            Path carpetaNueva = rootPath.resolve(nuevoNombre.toLowerCase());

            if (Files.exists(carpetaAnterior)) {
                Files.move(carpetaAnterior, carpetaNueva);
            }
        } catch (IOException e) {
            throw new RuntimeException("Error al renombrar carpeta de categoría: " + e.getMessage(), e);
        }
    }

    private void eliminarCarpetaCategoria(String nombreCategoria) {
        Path categoriaPath = rootPath.resolve(nombreCategoria.toLowerCase());
        if (Files.exists(categoriaPath)) {
            try (var paths = Files.walk(categoriaPath)) {
                paths.sorted(Comparator.reverseOrder())
                        .map(Path::toFile)
                        .forEach(file -> {
                            if (!file.delete()) {
                                throw new RuntimeException("No se pudo eliminar el archivo o carpeta: " + file.getAbsolutePath());
                            }
                        });
            } catch (IOException e) {
                throw new RuntimeException("Error al eliminar carpeta de categoría: " + e.getMessage(), e);
            }
        }
    }
}