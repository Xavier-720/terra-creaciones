package com.terracreaciones.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Representa un grupo de productos, por ejemplo "Bolsos". */
@Entity
@Table(name = "categories")
@Getter @Setter @NoArgsConstructor
public class Category {
    /** Identificador único de la categoría. */
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    /** Nombre corto usado en la dirección web. */
    @Column(nullable = false, unique = true)
    private String slug;
    /** Nombre que ve la gente. */
    @Column(nullable = false)
    private String name;
    /** Dibujito que acompaña al nombre. */
    private String emoji;
}
