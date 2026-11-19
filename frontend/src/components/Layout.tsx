import { useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useCategories, useSettings } from '../api/hooks';
import { useAuth } from '../context/AuthContext';
import { isAdmin, mapsLink, waLink } from '../lib';
import Watermarks from './Watermarks';

// Muestra el menú, el contenido de cada página y el pie con los datos del local.
export default function Layout() {
  // Trae las categorías que se muestran en el menú.
  const { data: categories } = useCategories();
  // Trae la dirección, los horarios y el WhatsApp del local.
  const { data: settings } = useSettings();
  // Lee quién está logueado y cómo salir.
  const { user, signOut } = useAuth();
  // Dirección actual, para volver arriba cuando cambia.
  const { pathname } = useLocation();
  // Vuelve arriba cada vez que se abre una página distinta.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Watermarks />
      <header>
        <div className="wrap nav">
          <div className="brandrow">
            <Link className="logolink" to="/" aria-label="Ir al inicio">
              <img className="logo" src="/logo.jpg" alt="Terra Creaciones" />
            </Link>
            <span className="brand">Terra Creaciones</span>
          </div>
          <nav className="cats" aria-label="Categorías">
            {categories?.map(c => (
              <NavLink key={c.id} to={`/categoria/${c.slug}`} className={({ isActive }) => `pill${isActive ? ' on' : ''}`}>
                <span aria-hidden="true">{c.emoji || '🧶'}</span> {c.name}
              </NavLink>
            ))}
            {isAdmin(user) && <NavLink to="/admin" className={({ isActive }) => `pill${isActive ? ' on' : ''}`}>⚙️ Admin</NavLink>}
            {user
              ? <button type="button" className="pill" onClick={() => void signOut()}>Salir</button>
              : <NavLink to="/ingresar" className={({ isActive }) => `pill${isActive ? ' on' : ''}`}>👤 Ingresar</NavLink>}
          </nav>
        </div>
      </header>
      <main className="wrap"><Outlet /></main>
      <footer>
        <div className="wrap">
          <div className="loc" id="ubicacion">
            <h2>Visitá nuestro local</h2>
            <p><strong>Terra Creaciones</strong><br />{settings?.address}<br />{settings?.hours}</p>
            <a className="map" href={mapsLink(settings?.address)} target="_blank" rel="noopener noreferrer">Ver en Google Maps</a>
            <div>
              <a className="btn" href={waLink(settings?.whatsapp, 'Hola Terra Creaciones! Quisiera hacer una consulta.')} target="_blank" rel="noopener noreferrer">
                Escribinos por WhatsApp
              </a>
            </div>
          </div>
          <p style={{ marginTop: 22 }}>© {new Date().getFullYear()} Terra Creaciones · Tejiendo sueños.</p>
        </div>
      </footer>
    </>
  );
}
