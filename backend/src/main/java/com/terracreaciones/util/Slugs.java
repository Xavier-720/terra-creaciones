package com.terracreaciones.util;

import java.text.Normalizer;
import java.util.Locale;
import java.util.function.Predicate;

/** Ayuda a crear nombres cortos y seguros para las direcciones web. */
public final class Slugs {
    /** Evita que se cree una instancia de esta clase de utilidades. */
    private Slugs() { }

    /** Convierte un texto en slug: sin tildes, en minúsculas y con guiones. */
    public static String of(String text) {
        String s = Normalizer.normalize(text, Normalizer.Form.NFD)
                .replaceAll("\\p{M}+", "")
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-|-$", "");
        return s.isEmpty() ? "item" : s;
    }

    /** Devuelve un slug que no exista todavía (agrega -2, -3, ... si hace falta). */
    public static String unique(String text, Predicate<String> exists) {
        String base = of(text);
        String candidate = base;
        int n = 2;
        while (exists.test(candidate)) candidate = base + "-" + n++;
        return candidate;
    }
}
