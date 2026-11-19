package com.terracreaciones.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Representa un color que pueden tener los productos. */
@Entity
@Table(name = "colors")
@Getter @Setter @NoArgsConstructor
public class Color {
    /** Identificador único del color. */
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    /** Nombre del color, por ejemplo "Lavanda". */
    @Column(nullable = false)
    private String name;
    /** Código del color, por ejemplo #d9c4f0. */
    @Column(nullable = false)
    private String hex;
}
