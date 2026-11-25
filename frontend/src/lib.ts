import type { User } from '@supabase/supabase-js';

// Arma un enlace de WhatsApp con el número y el mensaje ya listos.
export const waLink = (whatsapp: string | undefined, text: string) =>
  `https://wa.me/${(whatsapp ?? '').replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;

// Arma un enlace a Google Maps con la dirección del local.
export const mapsLink = (address: string | undefined) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address ?? '')}`;

export const isAdmin = (user: User | null | undefined) =>
  user?.role === 'ADMIN' || user?.app_metadata?.role === 'ADMIN' || user?.user_metadata?.role === 'ADMIN';

// Nombre que se muestra para la cuenta logueada (metadata o, si no hay, el email).
export const userDisplayName = (user: User | null | undefined) => {
  const meta = user?.user_metadata ?? {};
  const fromMeta = String(meta.name ?? meta.full_name ?? meta.display_name ?? '').trim();
  return fromMeta || user?.email?.split('@')[0] || 'Mi cuenta';
};

// Iniciales del account button: primera y última palabra del nombre (máximo dos letras).
export const userInitials = (user: User | null | undefined) => {
  const parts = userDisplayName(user)
    .replace(/[._-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return '?';
  return parts.length === 1
    ? parts[0].slice(0, 2).toUpperCase()
    : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
