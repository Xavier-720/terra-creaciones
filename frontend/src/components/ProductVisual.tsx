import type { ReactElement } from 'react';
import type { ColorT, Shape } from '../types';
import { imageSrc } from '../api/httpClient';

// Datos que recibe para mostrar la imagen del producto.
interface Props { name: string; shape: Shape; colors: ColorT[]; imageUrl: string | null }

/** Foto del producto o, si todavía no hay, una ilustración generada con sus colores. */
export default function ProductVisual({ name, shape, colors, imageUrl }: Props) {
  // Dirección de la foto subida, si es que hay una.
  const src = imageSrc(imageUrl);
  if (src) return <img src={src} alt={name} loading="lazy" />;

  // Toma los colores del producto para pintar el dibujo.
  const hs = colors.map(c => c.hex);
  const a = hs[0] ?? '#d9c4a8', b = hs[1] ?? a, c = hs[2] ?? a;
  let body: ReactElement;
  switch (shape) {
    case 'WALLET':
      body = (<>
        <path d="M60 70c0-34 80-34 80 0" fill="none" stroke={b} strokeWidth="7" strokeLinecap="round" />
        <rect x="38" y="70" width="124" height="86" rx="18" fill={a} />
        <path d="M38 90c0-12 124-12 124 0v6c0 40-124 40-124 0z" fill={b} />
        <circle cx="100" cy="112" r="8" fill={c} />
      </>);
      break;
    case 'TOY':
      body = (<>
        <circle cx="68" cy="66" r="18" fill={a} /><circle cx="132" cy="66" r="18" fill={a} />
        <circle cx="100" cy="112" r="50" fill={a} /><ellipse cx="100" cy="124" rx="22" ry="17" fill={b} />
        <circle cx="84" cy="102" r="5" fill="#4a3f55" /><circle cx="116" cy="102" r="5" fill="#4a3f55" />
        <ellipse cx="100" cy="120" rx="6" ry="4" fill={c} />
        <circle cx="100" cy="42" r="10" fill="none" stroke="#b9aec6" strokeWidth="4" />
      </>);
      break;
    case 'COASTER': {
      const pos = [[70, 70], [130, 70], [70, 130], [130, 130]];
      body = (<>{pos.map(([x, y], i) => {
        const fill = hs[i % (hs.length || 1)] ?? a;
        return (
          <g key={i}>
            {[0, 1, 2, 3, 4, 5].map(j => {
              const t = (j * Math.PI) / 3;
              return <circle key={j} cx={x + Math.cos(t) * 13} cy={y + Math.sin(t) * 13} r="10" fill={fill} />;
            })}
            <circle cx={x} cy={y} r="8" fill="#fbf3e4" />
          </g>
        );
      })}</>);
      break;
    }
    case 'BALL':
      body = (<>
        <circle cx="100" cy="100" r="54" fill={a} />
        <path d="M50 88c32 14 68 14 100 0" stroke={b} strokeWidth="9" fill="none" />
        <path d="M48 114c34 14 70 14 104 0" stroke={c} strokeWidth="9" fill="none" />
      </>);
      break;
    default:
      body = (<>
        <path d="M62 78c0-46 76-46 76 0" fill="none" stroke={b} strokeWidth="9" strokeLinecap="round" />
        <rect x="34" y="76" width="132" height="94" rx="20" fill={a} />
        <rect x="34" y="106" width="132" height="16" fill={b} />
        <rect x="34" y="136" width="132" height="12" fill={c} />
        <path d="M34 76h132" stroke={b} strokeWidth="6" />
      </>);
  }
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label={`Ilustración de ${name}`}>
      <rect width="200" height="200" fill="#f5ebdf" />
      {body}
    </svg>
  );
}
