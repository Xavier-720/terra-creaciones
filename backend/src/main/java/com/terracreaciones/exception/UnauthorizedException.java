package com.terracreaciones.exception;

/** Se lanza cuando el usuario no tiene permiso o sus datos de ingreso están mal. */
public class UnauthorizedException extends RuntimeException {
    /** Crea el error con el mensaje que recibe quien hizo la petición. */
    public UnauthorizedException(String message) { super(message); }
}
