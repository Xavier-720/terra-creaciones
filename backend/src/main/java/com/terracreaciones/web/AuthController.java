package com.terracreaciones.web;

import com.terracreaciones.dto.Dtos.*;
import com.terracreaciones.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/** Registro, ingreso y datos del usuario. */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService auth;

    /** Endpoint público: crea una cuenta nueva. */
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest in) {
        return auth.register(in);
    }

    /** Endpoint público: ingresa con correo y contraseña. */
    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest in) {
        return auth.login(in);
    }

    /** Endpoint privado: devuelve los datos del usuario ingresado. */
    @GetMapping("/me")
    public UserDto me(Authentication authentication) {
        return auth.me(authentication.getName());
    }
}
