package com.terracreaciones;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/** Arranca la aplicación Spring Boot. */
@SpringBootApplication
public class TerraApplication {
    /** Inicia el servidor y deja la aplicación lista para atender pedidos. */
    public static void main(String[] args) {
        SpringApplication.run(TerraApplication.class, args);
    }
}
