import { useParams } from 'react-router-dom';
import { useCategories, useProducts } from '../api/hooks';
import BackButton from '../components/BackButton';
import ProductCard from '../components/ProductCard';

// Muestra los productos de la categoría elegida y avisa si no hay ninguno.
export default function CategoryPage() {
  // Palabra que viene en la dirección y identifica la categoría.
  const { slug } = useParams();
  // Trae la lista de categorías.
  const categories = useCategories();
  // Trae los productos del catálogo.
  const products = useProducts();
  // Busca la categoría que coincide con esa palabra.
  const category = categories.data?.find(c => c.slug === slug);

  if (categories.isLoading || products.isLoading) return <p className="status">Cargando…</p>;
  if (!category) return <><BackButton /><p className="status">No encontramos esa categoría.</p></>;

  // Se queda solo con los productos de esa categoría.
  const list = (products.data ?? []).filter(p => p.category.id === category.id);
  return (
    <>
      <BackButton />
      <section>
        <h1 style={{ fontSize: 'clamp(1.8rem,5vw,2.6rem)', marginBottom: 22 }}>{category.name}</h1>
        {list.length ? <div className="grid">{list.map(p => <ProductCard key={p.id} product={p} />)}</div> : <p>Pronto vamos a sumar piezas acá.</p>}
      </section>
    </>
  );
}
