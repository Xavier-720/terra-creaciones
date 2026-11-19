import type { User } from '@supabase/supabase-js';

// Arma un enlace de WhatsApp con el número y el mensaje ya listos.
export const waLink = (whatsapp: string | undefined, text: string) =>
  `https://wa.me/${(whatsapp ?? '').replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;

// Arma un enlace a Google Maps con la dirección del local.
export const mapsLink = (address: string | undefined) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address ?? '')}`;

export const isAdmin = (user: User | null | undefined) =>
  user?.role === 'ADMIN' || user?.app_metadata?.role === 'ADMIN' || user?.user_metadata?.role === 'ADMIN';
