package com.terracreaciones.web;

import com.terracreaciones.dto.Dtos.*;
import com.terracreaciones.service.CatalogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/** Gestión del catálogo. Solo accesible con rol ADMIN (ver SecurityConfig). */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final CatalogService catalog;

    /** Endpoint solo admin: crea una categoría. */
    @PostMapping("/categories")
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryDto createCategory(@Valid @RequestBody CategoryInput in) { return catalog.createCategory(in); }

    /** Endpoint solo admin: cambia una categoría. */
    @PutMapping("/categories/{id}")
    public CategoryDto updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryInput in) { return catalog.updateCategory(id, in); }

    /** Endpoint solo admin: borra una categoría. */
    @DeleteMapping("/categories/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCategory(@PathVariable Long id) { catalog.deleteCategory(id); }

    /** Endpoint solo admin: crea un color. */
    @PostMapping("/colors")
    @ResponseStatus(HttpStatus.CREATED)
    public ColorDto createColor(@Valid @RequestBody ColorInput in) { return catalog.createColor(in); }

    /** Endpoint solo admin: cambia un color. */
    @PutMapping("/colors/{id}")
    public ColorDto updateColor(@PathVariable Long id, @Valid @RequestBody ColorInput in) { return catalog.updateColor(id, in); }

    /** Endpoint solo admin: borra un color. */
    @DeleteMapping("/colors/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteColor(@PathVariable Long id) { catalog.deleteColor(id); }

    /** Endpoint solo admin: crea un producto. */
    @PostMapping("/products")
    @ResponseStatus(HttpStatus.CREATED)
    public ProductDto createProduct(@Valid @RequestBody ProductInput in) { return catalog.createProduct(in); }

    /** Endpoint solo admin: cambia un producto. */
    @PutMapping("/products/{id}")
    public ProductDto updateProduct(@PathVariable Long id, @Valid @RequestBody ProductInput in) { return catalog.updateProduct(id, in); }

    /** Endpoint solo admin: borra un producto. */
    @DeleteMapping("/products/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@PathVariable Long id) { catalog.deleteProduct(id); }

    /** Endpoint solo admin: guarda los datos de contacto del local. */
    @PutMapping("/settings")
    public SettingsDto updateSettings(@Valid @RequestBody SettingsDto in) { return catalog.updateSettings(in); }
}
