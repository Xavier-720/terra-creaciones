package com.terracreaciones.service;

import com.terracreaciones.domain.*;
import com.terracreaciones.dto.Dtos.*;
import com.terracreaciones.exception.ConflictException;
import com.terracreaciones.exception.NotFoundException;
import com.terracreaciones.repository.*;
import com.terracreaciones.util.Slugs;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** Casos de uso del catálogo: categorías, colores, productos y datos del local. */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CatalogService {
    private final CategoryRepository categories;
    private final ColorRepository colors;
    private final ProductRepository products;
    private final SiteSettingsRepository settings;

    // ---------- categorías ----------
    /** Devuelve todas las categorías ordenadas por id. */
    public List<CategoryDto> listCategories() {
        return categories.findAll().stream().sorted((a, b) -> a.getId().compareTo(b.getId())).map(this::categoryDto).toList();
    }

    /** Crea una categoría nueva con un slug que no se repita. */
    @Transactional
    public CategoryDto createCategory(CategoryInput in) {
        Category c = new Category();
        c.setSlug(Slugs.unique(in.name(), categories::existsBySlug));
        c.setName(in.name().trim());
        c.setEmoji(blankToDefault(in.emoji(), "🧶"));
        return categoryDto(categories.save(c));
    }

    /** Cambia el nombre y el emoji de una categoría. */
    @Transactional
    public CategoryDto updateCategory(Long id, CategoryInput in) {
        Category c = categories.findById(id).orElseThrow(() -> new NotFoundException("Categoría no encontrada"));
        c.setName(in.name().trim());
        c.setEmoji(blankToDefault(in.emoji(), "🧶"));
        return categoryDto(c);
    }

    /** Borra una categoría, pero solo si no tiene productos. */
    @Transactional
    public void deleteCategory(Long id) {
        if (!categories.existsById(id)) throw new NotFoundException("Categoría no encontrada");
        if (products.existsByCategoryId(id)) {
            throw new ConflictException("Primero movés o eliminás los productos de esa categoría");
        }
        categories.deleteById(id);
    }

    // ---------- colores ----------
    /** Devuelve todos los colores ordenados por id. */
    public List<ColorDto> listColors() {
        return colors.findAll().stream().sorted((a, b) -> a.getId().compareTo(b.getId())).map(this::colorDto).toList();
    }

    /** Crea un color nuevo. */
    @Transactional
    public ColorDto createColor(ColorInput in) {
        Color c = new Color();
        c.setName(in.name().trim());
        c.setHex(in.hex().toLowerCase());
        return colorDto(colors.save(c));
    }

    /** Cambia el nombre y el código de un color. */
    @Transactional
    public ColorDto updateColor(Long id, ColorInput in) {
        Color c = colors.findById(id).orElseThrow(() -> new NotFoundException("Color no encontrado"));
        c.setName(in.name().trim());
        c.setHex(in.hex().toLowerCase());
        return colorDto(c);
    }

    /** Borra un color y lo quita de los productos que lo usaban. */
    @Transactional
    public void deleteColor(Long id) {
        if (!colors.existsById(id)) throw new NotFoundException("Color no encontrado");
        for (Product p : products.findAllUsingColor(id)) {
            p.getColors().removeIf(c -> c.getId().equals(id));
        }
        products.flush();
        colors.deleteById(id);
    }

    // ---------- productos ----------
    /** Devuelve productos, todos o solo los de una categoría. */
    public List<ProductDto> listProducts(String categorySlug) {
        List<Product> list = (categorySlug == null || categorySlug.isBlank())
                ? products.findAllByOrderByIdAsc()
                : products.findByCategorySlugOrderByIdAsc(categorySlug);
        return list.stream().map(this::productDto).toList();
    }

    /** Busca un producto por su slug y avisa si no lo encuentra. */
    public ProductDto getProduct(String slug) {
        return products.findBySlug(slug).map(this::productDto)
                .orElseThrow(() -> new NotFoundException("Producto no encontrado"));
    }

    /** Crea un producto nuevo con sus datos y relaciones. */
    @Transactional
    public ProductDto createProduct(ProductInput in) {
        Product p = new Product();
        p.setSlug(Slugs.unique(in.name(), products::existsBySlug));
        apply(p, in);
        return productDto(products.save(p));
    }

    /** Cambia los datos de un producto que ya existe. */
    @Transactional
    public ProductDto updateProduct(Long id, ProductInput in) {
        Product p = products.findById(id).orElseThrow(() -> new NotFoundException("Producto no encontrado"));
        apply(p, in);
        return productDto(p);
    }

    /** Borra un producto por su id. */
    @Transactional
    public void deleteProduct(Long id) {
        if (!products.existsById(id)) throw new NotFoundException("Producto no encontrado");
        products.deleteById(id);
    }

    // ---------- datos del local ----------
    /** Devuelve los datos de contacto del local. */
    public SettingsDto getSettings() {
        return settingsDto(settings.findById(1L).orElseThrow(() -> new NotFoundException("Faltan los datos del local")));
    }

    /** Guarda los datos de contacto del local. */
    @Transactional
    public SettingsDto updateSettings(SettingsDto in) {
        SiteSettings s = settings.findById(1L).orElseGet(SiteSettings::new);
        s.setWhatsapp(in.whatsapp().trim());
        s.setAddress(in.address().trim());
        s.setHours(in.hours().trim());
        return settingsDto(settings.save(s));
    }

    // ---------- mapeos ----------
    /** Carga en el producto los datos que llegaron en la petición. */
    private void apply(Product p, ProductInput in) {
        p.setName(in.name().trim());
        p.setDescription(in.description() == null ? "" : in.description().trim());
        List<String> features = new ArrayList<>();
        if (in.features() != null) in.features().stream().map(String::trim).filter(s -> !s.isEmpty()).forEach(features::add);
        p.getFeatures().clear();
        p.getFeatures().addAll(features);
        p.setShape(in.shape() == null ? Shape.BAG : in.shape());
        p.setImageUrl(in.imageUrl() == null || in.imageUrl().isBlank() ? null : in.imageUrl());
        p.setFeatured(in.featured());
        p.setCategory(categories.findById(in.categoryId()).orElseThrow(() -> new NotFoundException("Categoría no encontrada")));
        p.getColors().clear();
        if (in.colorIds() != null) {
            for (Long colorId : in.colorIds()) {
                p.getColors().add(colors.findById(colorId).orElseThrow(() -> new NotFoundException("Color no encontrado")));
            }
        }
    }

    /** Devuelve el valor por defecto cuando el texto está vacío. */
    private String blankToDefault(String v, String def) {
        return v == null || v.isBlank() ? def : v.trim();
    }

    /** Convierte una categoría en datos para la respuesta. */
    private CategoryDto categoryDto(Category c) {
        return new CategoryDto(c.getId(), c.getSlug(), c.getName(), c.getEmoji());
    }

    /** Convierte un color en datos para la respuesta. */
    private ColorDto colorDto(Color c) {
        return new ColorDto(c.getId(), c.getName(), c.getHex());
    }

    /** Convierte los ajustes en datos para la respuesta. */
    private SettingsDto settingsDto(SiteSettings s) {
        return new SettingsDto(s.getWhatsapp(), s.getAddress(), s.getHours());
    }

    /** Convierte un producto en datos para la respuesta. */
    private ProductDto productDto(Product p) {
        return new ProductDto(p.getId(), p.getSlug(), p.getName(), p.getDescription(), List.copyOf(p.getFeatures()),
                p.getShape(), p.getImageUrl(), p.isFeatured(), categoryDto(p.getCategory()),
                p.getColors().stream().map(this::colorDto).toList());
    }
}
