import type { ColorT } from '../types';

// Muestra una fila de puntitos con los colores del producto.
// Si no recibe colores, no muestra nada.
export default function ColorDots({ colors, large = false }: { colors: ColorT[]; large?: boolean }) {
  if (colors.length === 0) return null;
  return (
    <div className={`dots${large ? ' lg' : ''}`} aria-label={`Colores: ${colors.map(c => c.name).join(', ')}`}>
      {colors.map(c => <span key={c.id} className="dot" title={c.name} style={{ background: c.hex }} />)}
    </div>
  );
}
