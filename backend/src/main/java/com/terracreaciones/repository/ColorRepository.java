package com.terracreaciones.repository;

import com.terracreaciones.domain.Color;
import org.springframework.data.jpa.repository.JpaRepository;

/** Consultas a la tabla de colores. */
public interface ColorRepository extends JpaRepository<Color, Long> { }
