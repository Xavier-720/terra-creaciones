import { useTheme } from '../context/ThemeContext';

/** Interruptor sol/luna para cambiar entre modo claro y oscuro. */
export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const dark = theme === 'dark';

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={dark ? 'Activar modo claro' : 'Activar modo oscuro'}
      aria-pressed={dark}
      title={dark ? 'Modo claro' : 'Modo oscuro'}
      onClick={toggle}
    >
      <span className="knob">
        {dark ? (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
        )}
      </span>
    </button>
  );
}
