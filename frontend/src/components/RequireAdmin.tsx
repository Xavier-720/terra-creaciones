import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isAdmin } from '../lib';

// Solo deja ver la página si la persona logueada es administradora.
// Muestra "Cargando" mientras se averigua quién está logueado.
export default function RequireAdmin({ children }: { children: ReactNode }) {
  // Datos del usuario y aviso de si todavía se está cargando.
  const { user, loading } = useAuth();
  if (loading) return <p className="status">Cargando…</p>;
  if (!user) return <Navigate to="/ingresar" replace />;
  if (!isAdmin(user)) return <p className="status">Esta sección es solo para el administrador.</p>;
  return <>{children}</>;
}
