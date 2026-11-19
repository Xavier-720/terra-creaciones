import { Link, useParams } from 'react-router-dom';
import { useProduct, useProducts, useSettings } from '../api/hooks';
import BackButton from '../components/BackButton';
import ProductCard from '../components/ProductCard';
import ProductVisual from '../components/ProductVisual';
import { waLink } from '../lib';

// Muestra el detalle de un producto y otros parecidos para consultar por WhatsApp.
export default function ProductPage() {
  // Palabra de la dirección que identifica al producto.
  const { slug = '' } = useParams();
  // Trae ese producto, su estado de carga y si hubo error.
  const { data: p, isLoading, isError } = useProduct(slug);
  // Trae todos los productos para buscar parecidos.
  const all = useProducts();
  // Trae el WhatsApp para armar la consulta.
  const settings = useSettings();

  if (isLoading) return <p className="status">Cargando…</p>;
  if (isError || !p) return <><BackButton /><p className="status">No encontramos ese producto.</p></>;

  // Quita el producto que se está viendo de la lista de parecidos.
  const others = (all.data ?? []).filter(x => x.id !== p.id);
  // Pone primero los productos de la misma categoría y se queda con tres.
  const related = [...others.filter(x => x.category.id === p.category.id), ...others.filter(x => x.category.id !== p.category.id)].slice(0, 3);
  // Texto que se abre ya escrito en WhatsApp.
  const message = `Hola Terra Creaciones! Quisiera consultar la disponibilidad y el precio de: ${p.name}.`;

  return (
    <>
      <BackButton fallback={`/categoria/${p.category.slug}`} />
      <p className="crumb">
        <Link to="/">Inicio</Link> / <Link to={`/categoria/${p.category.slug}`}>{p.category.name}</Link> / {p.name}
      </p>
      <div className="detail">
        <div className="ph"><ProductVisual name={p.name} shape={p.shape} colors={p.colors} imageUrl={p.imageUrl} /></div>
        <div>
          <h1 style={{ fontSize: 'clamp(1.8rem,5vw,2.6rem)' }}>{p.name}</h1>
          <p style={{ color: 'var(--mut)', margin: '12px 0 18px' }}>{p.description} Tejido a mano: cada pieza puede variar levemente.</p>
          {p.features.length > 0 && <ul className="feat">{p.features.map((f, i) => <li key={i}>{f}</li>)}</ul>}
          {p.colors.length > 0 && (
            <>
              <strong>Colores de esta pieza</strong>
              <div className="palette">
                {p.colors.map(c => (
                  <span key={c.id}><i className="dot" style={{ width: 38, height: 38, background: c.hex }} />{c.name}</span>
                ))}
              </div>
            </>
          )}
          <a className="btn" href={waLink(settings.data?.whatsapp, message)} target="_blank" rel="noopener noreferrer">Consultar por WhatsApp</a>
        </div>
      </div>
      {related.length > 0 && (
        <section>
          <h2>También te puede gustar</h2>
          <div className="grid">{related.map(x => <ProductCard key={x.id} product={x} />)}</div>
        </section>
      )}
    </>
  );
}
