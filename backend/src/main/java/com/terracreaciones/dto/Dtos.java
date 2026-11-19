package com.terracreaciones.dto;

import com.terracreaciones.domain.Role;
import com.terracreaciones.domain.Shape;
import jakarta.validation.constraints.*;

import java.util.List;

/** Contratos de la API (entrada y salida). */
public final class Dtos {
    /** Evita que se cree una instancia de esta clase de contratos. */
    private Dtos() { }

    /** Datos de una categoría que se envían al navegador. */
    public record CategoryDto(Long id, String slug, String name, String emoji) { }
    /** Datos que se reciben para crear o cambiar una categoría. */
    public record CategoryInput(@NotBlank @Size(max = 80) String name, @Size(max = 16) String emoji) { }

    /** Datos de un color que se envían al navegador. */
    public record ColorDto(Long id, String name, String hex) { }
    /** Datos que se reciben para crear o cambiar un color. */
    public record ColorInput(@NotBlank @Size(max = 60) String name,
                             @NotBlank @Pattern(regexp = "^#[0-9a-fA-F]{6}$", message = "El color debe ser un hexadecimal como #d9c4f0") String hex) { }

    /** Datos de un producto que se envían al navegador. */
    public record ProductDto(Long id, String slug, String name, String description, List<String> features,
                             Shape shape, String imageUrl, boolean featured, CategoryDto category,
                             List<ColorDto> colors) { }
    /** Datos que se reciben para crear o cambiar un producto. */
    public record ProductInput(@NotBlank @Size(max = 120) String name,
                               @Size(max = 500) String description,
                               List<@Size(max = 200) String> features,
                               Shape shape,
                               @Size(max = 255) String imageUrl,
                               boolean featured,
                               @NotNull Long categoryId,
                               List<Long> colorIds) { }

    /** Datos de contacto del local que se envían o se reciben. */
    public record SettingsDto(@NotBlank @Size(max = 30) String whatsapp,
                              @NotBlank @Size(max = 200) String address,
                              @NotBlank @Size(max = 200) String hours) { }

    /** Datos necesarios para crear una cuenta nueva. */
    public record RegisterRequest(@NotBlank @Email String email,
                                  @NotBlank @Size(max = 100) String name,
                                  @NotBlank @Size(min = 8, max = 72, message = "La contraseña debe tener al menos 8 caracteres") String password) { }
    /** Correo y contraseña para ingresar. */
    public record LoginRequest(@NotBlank String email, @NotBlank String password) { }
    /** Datos públicos de un usuario. */
    public record UserDto(Long id, String email, String name, Role role) { }
    /** Token de acceso junto con los datos del usuario. */
    public record AuthResponse(String token, UserDto user) { }
}
