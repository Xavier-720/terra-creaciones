package com.terracreaciones.exception;

/** Se lanza cuando se pide algo que no existe. */
public class NotFoundException extends RuntimeException {
    /** Crea el error con el mensaje que recibe quien hizo la petición. */
    public NotFoundException(String message) { super(message); }
}
