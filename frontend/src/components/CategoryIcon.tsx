// Ajustes que comparten todos los íconos dibujados.
const common = { viewBox: '0 0 48 48', 'aria-hidden': true } as const;

/** Muestra el emoji elegido por el usuario o los íconos trazados por defecto. */
export default function CategoryIcon({ slug, emoji }: { slug: string; emoji?: string | null }) {
  if (emoji && emoji.trim()) {
    return <span className="emo">{emoji.trim()}</span>;
  }
  if (slug === 'bolsos') {
    return <svg {...common}><path d="M16 20c0-12 16-12 16 0" /><path d="M8 20h32l-3 22H11z" /><path d="M18 28h12" /></svg>;
  }
  if (slug === 'carteras') {
    return <svg {...common}><rect x="6" y="13" width="36" height="25" rx="5" /><path d="M6 21h36" /><circle cx="33" cy="29" r="2" /></svg>;
  }
  if (slug === 'otros') {
    return <svg {...common}><circle cx="22" cy="24" r="15" /><path d="M8 19c8 5 20 5 28 0M8 28c9 5 21 5 29 0M15 36c5-3 11-3 15 0" /><path d="M35 36c4 3 8 2 9-3" /></svg>;
  }
  return <span className="emo">🧶</span>;
}
