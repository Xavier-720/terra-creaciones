package com.terracreaciones;

import com.terracreaciones.util.Slugs;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;

/** Pruebas de los nombres usados en las direcciones web. */
class SlugsTest {
    /** Comprueba que se quiten tildes, símbolos y espacios de más. */
    @Test
    void removesAccentsAndSymbols() {
        assertEquals("bolso-sol", Slugs.of("Bolso Sol"));
        assertEquals("posavasos-flor", Slugs.of("  ¡Posavasos Flor! "));
    }

    /** Comprueba que se agregue un número si el slug ya está ocupado. */
    @Test
    void appendsSuffixWhenTaken() {
        assertEquals("bolso-2", Slugs.unique("Bolso", Set.of("bolso")::contains));
    }
}
