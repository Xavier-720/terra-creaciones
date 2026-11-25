import { useState } from 'react';
import BackButton from '../../components/BackButton';
import ProductsAdmin from './ProductsAdmin';
import CategoriesAdmin from './CategoriesAdmin';
import ColorsAdmin from './ColorsAdmin';
import SettingsAdmin from './SettingsAdmin';

// Secciones que tiene el panel de administración.
const TABS = [
  { id: 'productos', label: 'Productos' },
  { id: 'categorias', label: 'Categorías' },
  { id: 'colores', label: 'Paleta de colores' },
  { id: 'local', label: 'Local y contacto' },
] as const;
// Nombres posibles de esas secciones.
type TabId = (typeof TABS)[number]['id'];

// Muestra el panel y la lista o el formulario de la sección elegida.
export default function AdminPage() {
  const [tab, setTab] = useState<TabId>('productos');

  return (
    <div className="adm">
      <BackButton />
      <h1 style={{ fontSize: 'clamp(1.6rem,5vw,2.2rem)', margin: '14px 0' }}>Panel de administración</h1>
      <div className="row tabs">
        {TABS.map(t => (
          <button key={t.id} type="button" className={`back tab${tab === t.id ? ' on' : ''}`} style={{ marginTop: 0 }} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'productos' && <ProductsAdmin />}
      {tab === 'categorias' && <CategoriesAdmin />}
      {tab === 'colores' && <ColorsAdmin />}
      {tab === 'local' && <SettingsAdmin />}
    </div>
  );
}
