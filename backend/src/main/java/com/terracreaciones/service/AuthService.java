package com.terracreaciones.service;

import com.terracreaciones.domain.AppUser;
import com.terracreaciones.domain.Role;
import com.terracreaciones.dto.Dtos.*;
import com.terracreaciones.exception.ConflictException;
import com.terracreaciones.exception.NotFoundException;
import com.terracreaciones.exception.UnauthorizedException;
import com.terracreaciones.repository.UserRepository;
import com.terracreaciones.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Maneja el registro, el ingreso y los datos de los usuarios. */
@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    /** Crea una cuenta nueva y devuelve un token para usarla. */
    @Transactional
    public AuthResponse register(RegisterRequest in) {
        String email = in.email().trim().toLowerCase();
        if (users.existsByEmail(email)) throw new ConflictException("Ya existe una cuenta con ese email");
        AppUser u = new AppUser();
        u.setEmail(email);
        u.setName(in.name().trim());
        u.setPasswordHash(encoder.encode(in.password()));
        u.setRole(Role.USER);
        users.save(u);
        return new AuthResponse(jwt.generate(u), toDto(u));
    }

    /** Revisa el correo y la contraseña, y devuelve un token si están bien. */
    public AuthResponse login(LoginRequest in) {
        AppUser u = users.findByEmail(in.email().trim().toLowerCase())
                .filter(x -> encoder.matches(in.password(), x.getPasswordHash()))
                .orElseThrow(() -> new UnauthorizedException("Email o contraseña incorrectos"));
        return new AuthResponse(jwt.generate(u), toDto(u));
    }

    /** Devuelve los datos del usuario que está ingresado. */
    public UserDto me(String email) {
        return users.findByEmail(email).map(this::toDto).orElseThrow(() -> new NotFoundException("Usuario no encontrado"));
    }

    /** Convierte un usuario en datos para la respuesta. */
    private UserDto toDto(AppUser u) {
        return new UserDto(u.getId(), u.getEmail(), u.getName(), u.getRole());
    }
}
