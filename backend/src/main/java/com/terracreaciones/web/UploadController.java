package com.terracreaciones.web;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.UUID;

/** Subida de fotos de productos (solo ADMIN). Guarda en disco; en producción conviene un storage externo. */
@RestController
@RequestMapping("/api/admin")
public class UploadController {
    private final Path uploads;

    /** Prepara la carpeta donde se guardan las fotos. */
    public UploadController(@Value("${app.uploads-dir}") String dir) throws IOException {
        this.uploads = Path.of(dir).toAbsolutePath();
        Files.createDirectories(uploads);
    }

    /** Endpoint solo admin: guarda una foto JPG, PNG o WebP y devuelve su dirección. */
    @PostMapping("/uploads")
    public Map<String, String> upload(@RequestParam("file") MultipartFile file) throws IOException {
        String type = file.getContentType() == null ? "" : file.getContentType();
        String ext = switch (type) {
            case "image/jpeg" -> "jpg";
            case "image/png" -> "png";
            case "image/webp" -> "webp";
            default -> throw new IllegalArgumentException("Formato no permitido: usá JPG, PNG o WebP");
        };
        String name = UUID.randomUUID() + "." + ext;
        try (InputStream in = file.getInputStream()) {
            Files.copy(in, uploads.resolve(name));
        }
        return Map.of("url", "/uploads/" + name);
    }
}
