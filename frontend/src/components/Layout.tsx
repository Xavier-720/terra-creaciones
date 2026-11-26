import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useCategories, useSettings } from '../api/hooks';
import { useAuth } from '../context/AuthContext';
import { isAdmin, mapsLink, userDisplayName, userInitials, waLink } from '../lib';
import ThemeToggle from './ThemeToggle';
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
  // Permite volver al inicio después de cerrar la sesión.
  const navigate = useNavigate();
  // Estado del menú de la cuenta y referencia para cerrarlo al tocar fuera.
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  // Vuelve arriba y cierra el menú cada vez que se abre una página distinta.
  useEffect(() => {
    window.scrollTo(0, 0);
    setAccountOpen(false);
  }, [pathname]);

  // Cierra el menú de la cuenta al tocar en cualquier otro lugar.
  useEffect(() => {
    if (!accountOpen) return;
    const close = (event: MouseEvent) => {
      if (!accountRef.current?.contains(event.target as Node)) setAccountOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [accountOpen]);

  // Cierra la sesión y vuelve al inicio aunque Supabase no responda.
  const logout = async () => {
    setAccountOpen(false);
    try {
      await signOut();
    } catch (err) {
      console.warn('No se pudo cerrar la sesión en Supabase:', err);
    }
    navigate('/', { replace: true });
  };

  const displayName = userDisplayName(user);

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
          </nav>
          <div className="nav-actions">
            <ThemeToggle />
            {user ? (
              <div className="account" ref={accountRef}>
                <button
                  type="button"
                  className="avatar"
                  aria-haspopup="menu"
                  aria-expanded={accountOpen}
                  aria-label={`Sesión iniciada como ${displayName}${user.email ? ` (${user.email})` : ''}`}
                  title={`Sesión iniciada como ${displayName}`}
                  onClick={() => setAccountOpen(open => !open)}
                >
                  {userInitials(user)}
                </button>
                {accountOpen && (
                  <div className="account-menu" role="menu">
                    <p className="name">Hola, {displayName}</p>
                    {user.email && <p className="email">{user.email}</p>}
                    {isAdmin(user) && (
                      <NavLink to="/admin" role="menuitem" className="sm" onClick={() => setAccountOpen(false)}>
                        ⚙️ Panel de administración
                      </NavLink>
                    )}
                    <button type="button" role="menuitem" className="sm" onClick={() => void logout()}>
                      Salir de la cuenta
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <NavLink to="/ingresar" className={({ isActive }) => `pill${isActive ? ' on' : ''}`}>👤 Ingresar</NavLink>
            )}
          </div>
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
