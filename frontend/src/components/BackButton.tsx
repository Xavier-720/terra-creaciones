import { useNavigate } from 'react-router-dom';

/** Vuelve a la pantalla anterior; si se entró directo por un enlace, va a la ruta indicada. */
export default function BackButton({ fallback = '/' }: { fallback?: string }) {
  // Permite moverse a otra página.
  const navigate = useNavigate();
  // Vuelve atrás si se puede; si no, abre la página indicada.
  const go = () => (window.history.state?.idx > 0 ? navigate(-1) : navigate(fallback));
  return (
    <button className="back" type="button" onClick={go}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M19 12H5M11 5l-7 7 7 7" />
      </svg>
      Volver
    </button>
  );
}
