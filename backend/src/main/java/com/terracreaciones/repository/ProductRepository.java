package com.terracreaciones.repository;

import com.terracreaciones.domain.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/** Consultas a la tabla de productos. */
public interface ProductRepository extends JpaRepository<Product, Long> {
    /** Busca un producto por su slug. */
    Optional<Product> findBySlug(String slug);
    /** Indica si ya existe un producto con ese slug. */
    boolean existsBySlug(String slug);
    /** Indica si hay productos en esa categoría. */
    boolean existsByCategoryId(Long categoryId);
    /** Devuelve todos los productos ordenados por id. */
    List<Product> findAllByOrderByIdAsc();
    /** Devuelve los productos de una categoría ordenados por id. */
    List<Product> findByCategorySlugOrderByIdAsc(String slug);

    /** Devuelve los productos que usan un color. */
    @Query("select distinct p from Product p join p.colors c where c.id = :colorId")
    List<Product> findAllUsingColor(@Param("colorId") Long colorId);
}
