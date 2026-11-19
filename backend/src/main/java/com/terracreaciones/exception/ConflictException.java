package com.terracreaciones.exception;

/** Se lanza cuando algo ya existe o no se puede borrar porque está en uso. */
public class ConflictException extends RuntimeException {
    /** Crea el error con el mensaje que recibe quien hizo la petición. */
    public ConflictException(String message) { super(message); }
}
