package com.terracreaciones.repository;

import com.terracreaciones.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;

/** Consultas a la tabla de categorías. */
public interface CategoryRepository extends JpaRepository<Category, Long> {
    /** Indica si ya existe una categoría con ese slug. */
    boolean existsBySlug(String slug);
}
