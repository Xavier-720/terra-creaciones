import { Link } from 'react-router-dom';
import { useCategories, useProducts } from '../api/hooks';
import CategoryIcon from '../components/CategoryIcon';
import ProductCard from '../components/ProductCard';

// Muestra el inicio con las categorías y los productos destacados.
export default function HomePage() {
  // Trae las categorías del catálogo.
  const categories = useCategories();
  // Trae los productos para contarlos y elegir los destacados.
  const products = useProducts();
  if (categories.isError || products.isError) return <p className="status">No pudimos cargar el catálogo. Probá de nuevo en un momento.</p>;

  const list = products.data ?? [];
  // Muestra solo los productos marcados como destacados (máximo 12), igual que indica el panel.
  const featured = list.filter(p => p.featured).slice(0, 12);
  // Cuenta cuántos modelos tiene una categoría.
  const count = (id: number) => list.filter(p => p.category.id === id).length;

  return (
    <>
      <div className="hero">
        <div>
          <h1>Tejiendo sueños</h1>
          <p>Bolsos, carteras y pequeños objetos tejidos a mano, uno por uno, con dedicación y buen gusto. Elegí una categoría y consultanos por WhatsApp.</p>
        </div>
        <div className="big">
          {categories.data?.map(c => (
            <Link key={c.id} to={`/categoria/${c.slug}`}>
              <CategoryIcon slug={c.slug} emoji={c.emoji} />
              {c.name}
              <small>{count(c.id)} {count(c.id) === 1 ? 'modelo' : 'modelos'}</small>
            </Link>
          ))}
        </div>
      </div>
      {featured.length > 0 && (
        <section>
          <h2>Destacados</h2>
          <div className="grid">{featured.map(p => <ProductCard key={p.id} product={p} />)}</div>
        </section>
      )}
    </>
  );
}
