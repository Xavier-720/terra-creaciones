package com.terracreaciones.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Representa a una persona que usa la tienda: cliente o administrador. */
@Entity
@Table(name = "app_users")
@Getter @Setter @NoArgsConstructor
public class AppUser {
    /** Identificador único del usuario. */
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    /** Correo con el que ingresa. */
    @Column(nullable = false, unique = true)
    private String email;
    /** Nombre visible del usuario. */
    @Column(nullable = false)
    private String name;
    /** Contraseña guardada de forma cifrada. */
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;
    /** Permiso del usuario: cliente o administrador. */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;
}
