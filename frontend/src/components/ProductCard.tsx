import { Link } from 'react-router-dom';
import type { Product } from '../types';
import ProductVisual from './ProductVisual';
import ColorDots from './ColorDots';

// Muestra una tarjeta con la imagen, el nombre y los colores de un producto.
// Al tocarla, abre la página con el detalle de ese producto.
export default function ProductCard({ product: p }: { product: Product }) {
  return (
    <Link className="card" to={`/producto/${p.slug}`}>
      <span className="ph"><ProductVisual name={p.name} shape={p.shape} colors={p.colors} imageUrl={p.imageUrl} /></span>
      <h3>{p.name}</h3>
      <p>{p.description}</p>
      <ColorDots colors={p.colors} />
    </Link>
  );
}
