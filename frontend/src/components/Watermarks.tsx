import type { CSSProperties } from 'react';

// Marcas de agua decorativas: solo huellas y ovillos, en dos columnas con separación pareja.
// Datos de una marca: dibujo, lado, altura, tamaño y giro.
type Mark = { k: 'paw' | 'yarn'; side: 'left' | 'right'; top: number; size: number; rot: number };
// Lista de marcas que se dibujan en pantalla.
const MARKS: Mark[] = [
  { k: 'yarn', side: 'left', top: 7, size: 36, rot: 0 },
  { k: 'paw', side: 'left', top: 24, size: 28, rot: -20 },
  { k: 'yarn', side: 'left', top: 42, size: 32, rot: 0 },
  { k: 'paw', side: 'left', top: 60, size: 28, rot: -30 },
  { k: 'yarn', side: 'left', top: 78, size: 38, rot: 0 },
  { k: 'paw', side: 'left', top: 92, size: 26, rot: -15 },
  { k: 'paw', side: 'right', top: 15, size: 28, rot: 25 },
  { k: 'yarn', side: 'right', top: 33, size: 34, rot: 0 },
  { k: 'paw', side: 'right', top: 51, size: 28, rot: 35 },
  { k: 'yarn', side: 'right', top: 69, size: 32, rot: 0 },
  { k: 'paw', side: 'right', top: 86, size: 28, rot: 20 },
];

// Dibuja las huellas y los ovillos decorativos de fondo.
export default function Watermarks() {
  return (
    <div id="wm" aria-hidden="true">
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <symbol id="paw" viewBox="0 0 64 64">
            <ellipse cx="32" cy="43" rx="14" ry="11" /><ellipse cx="13" cy="27" rx="6" ry="8" />
            <ellipse cx="25" cy="15" rx="6" ry="8" /><ellipse cx="39" cy="15" rx="6" ry="8" />
            <ellipse cx="51" cy="27" rx="6" ry="8" />
          </symbol>
          <symbol id="yarn" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <circle cx="36" cy="40" r="28" />
            <path d="M10 30c14 8 40 8 52-2M9 44c16 8 42 8 54-2M16 60c12 5 28 5 40-2M60 62c8 6 14 4 17-4" />
          </symbol>
        </defs>
      </svg>
      {MARKS.map((m, i) => (
        <svg key={i} style={{ [m.side]: '1.5%', top: `${m.top}%`, width: m.size, height: m.size, transform: `rotate(${m.rot}deg)` } as CSSProperties}>
          <use href={`#${m.k}`} />
        </svg>
      ))}
    </div>
  );
}
