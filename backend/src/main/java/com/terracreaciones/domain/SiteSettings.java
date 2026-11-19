package com.terracreaciones.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Guarda los datos de contacto del local: WhatsApp, dirección y horarios. */
@Entity
@Table(name = "site_settings")
@Getter @Setter @NoArgsConstructor
public class SiteSettings {
    /** Siempre vale 1, porque hay una sola fila de ajustes. */
    @Id
    private Long id = 1L;
    /** Número de WhatsApp del local. */
    @Column(nullable = false)
    private String whatsapp;
    /** Dirección del local. */
    @Column(nullable = false)
    private String address;
    /** Horarios de atención. */
    @Column(nullable = false)
    private String hours;
}
