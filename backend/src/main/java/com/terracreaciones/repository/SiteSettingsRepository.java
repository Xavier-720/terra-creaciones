package com.terracreaciones.repository;

import com.terracreaciones.domain.SiteSettings;
import org.springframework.data.jpa.repository.JpaRepository;

/** Consultas a los datos de contacto del local. */
public interface SiteSettingsRepository extends JpaRepository<SiteSettings, Long> { }
