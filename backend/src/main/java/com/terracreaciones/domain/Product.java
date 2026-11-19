package com.terracreaciones.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

/** Representa un producto de la tienda con su foto, colores y categoría. */
@Entity
@Table(name = "products")
@Getter @Setter @NoArgsConstructor
public class Product {
    /** Identificador único del producto. */
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    /** Nombre corto usado en la dirección web. */
    @Column(nullable = false, unique = true)
    private String slug;
    /** Nombre que ve la gente. */
    @Column(nullable = false)
    private String name;
    /** Texto que cuenta de qué se trata el producto. */
    @Column(nullable = false)
    private String description = "";

    /** Lista de detalles del producto, por ejemplo "Hecho a mano". */
    @ElementCollection
    @CollectionTable(name = "product_features", joinColumns = @JoinColumn(name = "product_id"))
    @OrderColumn(name = "position")
    @Column(name = "feature", nullable = false)
    private List<String> features = new ArrayList<>();

    /** Dibujo que se muestra si el producto no tiene foto. */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Shape shape = Shape.BAG;
    /** Dirección de la foto del producto. */
    private String imageUrl;
    /** Marca si el producto se muestra como destacado. */
    private boolean featured;

    /** Categoría a la que pertenece el producto. */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id")
    private Category category;

    /** Colores en los que se ofrece el producto. */
    @ManyToMany
    @JoinTable(name = "product_colors",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "color_id"))
    @OrderColumn(name = "position")
    private List<Color> colors = new ArrayList<>();
}
