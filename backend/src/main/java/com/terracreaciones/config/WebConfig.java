package com.terracreaciones.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

/** Sirve las fotos subidas desde la carpeta de uploads. */
@Configuration
public class WebConfig implements WebMvcConfigurer {
    private final Path uploads;

    /** Prepara la carpeta de fotos y recuerda dónde está. */
    public WebConfig(@Value("${app.uploads-dir}") String dir) throws IOException {
        this.uploads = Path.of(dir).toAbsolutePath();
        Files.createDirectories(uploads);
    }

    /** Hace que las fotos subidas se vean en la dirección /uploads. */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**").addResourceLocations("file:" + uploads + "/");
    }
}
