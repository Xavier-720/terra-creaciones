package com.terracreaciones.repository;

import com.terracreaciones.domain.AppUser;
import com.terracreaciones.domain.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/** Consultas a la tabla de usuarios. */
public interface UserRepository extends JpaRepository<AppUser, Long> {
    /** Busca un usuario por su correo. */
    Optional<AppUser> findByEmail(String email);
    /** Indica si ya hay una cuenta con ese correo. */
    boolean existsByEmail(String email);
    /** Indica si existe algún usuario con ese permiso. */
    boolean existsByRole(Role role);
}
