package com.terracreaciones.web;

import com.terracreaciones.dto.Dtos.*;
import com.terracreaciones.service.CatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Lectura pública del catálogo. */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CatalogController {
    private final CatalogService catalog;

    /** Endpoint público: devuelve todas las categorías. */
    @GetMapping("/categories")
    public List<CategoryDto> categories() {
        return catalog.listCategories();
    }

    /** Endpoint público: devuelve todos los colores. */
    @GetMapping("/colors")
    public List<ColorDto> colors() {
        return catalog.listColors();
    }

    /** Endpoint público: devuelve productos, con filtro opcional por categoría. */
    @GetMapping("/products")
    public List<ProductDto> products(@RequestParam(required = false) String category) {
        return catalog.listProducts(category);
    }

    /** Endpoint público: devuelve un producto por su slug. */
    @GetMapping("/products/{slug}")
    public ProductDto product(@PathVariable String slug) {
        return catalog.getProduct(slug);
    }

    /** Endpoint público: devuelve los datos de contacto del local. */
    @GetMapping("/settings")
    public SettingsDto settings() {
        return catalog.getSettings();
    }
}
