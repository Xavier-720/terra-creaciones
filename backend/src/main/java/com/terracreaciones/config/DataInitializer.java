package com.terracreaciones.config;

import com.terracreaciones.domain.AppUser;
import com.terracreaciones.domain.Role;
import com.terracreaciones.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/** Crea la cuenta de administrador la primera vez, a partir de ADMIN_EMAIL y ADMIN_PASSWORD. */
@Component
public class DataInitializer implements ApplicationRunner {
    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final String email;
    private final String password;

    /** Guarda los datos del administrador que vienen de la configuración. */
    public DataInitializer(UserRepository users, PasswordEncoder encoder,
                           @Value("${app.admin.email:}") String email,
                           @Value("${app.admin.password:}") String password) {
        this.users = users;
        this.encoder = encoder;
        this.email = email;
        this.password = password;
    }

    /** Crea el administrador solo si no existe y los datos son válidos. */
    @Override
    public void run(ApplicationArguments args) {
        if (users.existsByRole(Role.ADMIN)) return;
        if (email.isBlank() || password.length() < 8) {
            log.warn("No hay administrador: definí ADMIN_EMAIL y ADMIN_PASSWORD (mínimo 8 caracteres).");
            return;
        }
        AppUser admin = new AppUser();
        admin.setEmail(email.trim().toLowerCase());
        admin.setName("Administrador");
        admin.setPasswordHash(encoder.encode(password));
        admin.setRole(Role.ADMIN);
        users.save(admin);
        log.info("Administrador creado: {}", admin.getEmail());
    }
}
