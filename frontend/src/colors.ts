import type { ColorT } from './types';

/** Paleta amplia que se puede cargar en la tabla `colors` de Supabase con un toque. */
export const EXTRA_COLORS: ReadonlyArray<{ name: string; hex: string }> = [
  // Neutros
  { name: 'Blanco', hex: '#ffffff' },
  { name: 'Blanco roto', hex: '#f0ebf3' },
  { name: 'Marfil', hex: '#f5efe2' },
  { name: 'Crema', hex: '#fbf3e4' },
  { name: 'Beige', hex: '#e3d1b8' },
  { name: 'Arena', hex: '#d9c4a8' },
  { name: 'Gris perla', hex: '#eae7e3' },
  { name: 'Gris claro', hex: '#d3d0cb' },
  { name: 'Gris', hex: '#9e9a94' },
  { name: 'Gris oscuro', hex: '#5f5b57' },
  { name: 'Carbón', hex: '#33302e' },
  { name: 'Negro', hex: '#181614' },
  // Rosas y violetas
  { name: 'Rosa bebé', hex: '#f8dfe8' },
  { name: 'Rosa palo', hex: '#e9bcc2' },
  { name: 'Rosa', hex: '#f6c3d6' },
  { name: 'Rosa fuerte', hex: '#e884a8' },
  { name: 'Frambuesa', hex: '#c9426b' },
  { name: 'Cereza', hex: '#ae2d45' },
  { name: 'Fucsia', hex: '#d63384' },
  { name: 'Magenta', hex: '#a02a8c' },
  { name: 'Lila', hex: '#d9c4f0' },
  { name: 'Lavanda', hex: '#c3b5e8' },
  { name: 'Violeta', hex: '#9166c9' },
  { name: 'Morado', hex: '#6b3fa0' },
  { name: 'Ciruela', hex: '#7c3b63' },
  { name: 'Berenjena', hex: '#55304a' },
  // Rojos, naranjas y amarillos
  { name: 'Coral', hex: '#f28b7d' },
  { name: 'Salmón', hex: '#f4a58f' },
  { name: 'Durazno', hex: '#fbcfb8' },
  { name: 'Naranja', hex: '#f09a4b' },
  { name: 'Terracota', hex: '#b96a4f' },
  { name: 'Ladrillo', hex: '#9c4b3c' },
  { name: 'Rojo', hex: '#cf3b3b' },
  { name: 'Mostaza', hex: '#d9a52b' },
  { name: 'Ocre', hex: '#bd8b3c' },
  { name: 'Ámbar', hex: '#e3a13c' },
  { name: 'Amarillo', hex: '#f4d94a' },
  { name: 'Manteca', hex: '#f7e29b' },
  { name: 'Dorado', hex: '#d4af37' },
  // Verdes
  { name: 'Menta', hex: '#c5ebd9' },
  { name: 'Verde agua', hex: '#a8ddcf' },
  { name: 'Salvia', hex: '#bfd8bd' },
  { name: 'Verde lima', hex: '#c6dd7b' },
  { name: 'Verde pastel', hex: '#d8e8c4' },
  { name: 'Verde oliva', hex: '#9a9d52' },
  { name: 'Verde musgo', hex: '#6f7d4e' },
  { name: 'Verde esmeralda', hex: '#3f9c78' },
  { name: 'Verde jungle', hex: '#2f6b52' },
  // Azules y turquesas
  { name: 'Celeste', hex: '#bcdaf4' },
  { name: 'Celeste pastel', hex: '#d8ecfa' },
  { name: 'Aguamarina', hex: '#9ddcd7' },
  { name: 'Turquesa', hex: '#57bfb4' },
  { name: 'Azul cielo', hex: '#7fb8e8' },
  { name: 'Azul cobalto', hex: '#3f6fc4' },
  { name: 'Azul', hex: '#3d5fa8' },
  { name: 'Azul petróleo', hex: '#2f6b78' },
  { name: 'Azul marino', hex: '#263656' },
  // Marrones y neutros cálidos
  { name: 'Café con leche', hex: '#cfb295' },
  { name: 'Caramelo', hex: '#b9834f' },
  { name: 'Avellana', hex: '#9c6b4a' },
  { name: 'Cognac', hex: '#a4613b' },
  { name: 'Café', hex: '#7a5238' },
  { name: 'Chocolate', hex: '#4d3324' },
  { name: 'Tabaco', hex: '#6b4a34' },
  // Metálicos
  { name: 'Plata', hex: '#c9c9cd' },
  { name: 'Oro', hex: '#c8a951' },
  { name: 'Bronce', hex: '#a9753c' },
];

type RGB = [number, number, number];

export const hexToRgb = (hex: string): RGB => {
  const value = hex.replace('#', '');
  const full = value.length === 3 ? value.split('').map(c => c + c).join('') : value;
  const num = Number.parseInt(full, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
};

export const rgbToHex = ([r, g, b]: RGB): string =>
  `#${[r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('')}`;

/** Distancia de color en RGB con ponderación perceptual (redmean). */
const rgbDistance = ([r1, g1, b1]: RGB, [r2, g2, b2]: RGB): number => {
  const dr = r1 - r2, dg = g1 - g2, db = b1 - b2;
  const rm = (r1 + r2) / 2;
  return Math.sqrt((2 + rm / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rm) / 256) * db * db);
};

export const colorDistance = (a: string, b: string): number => rgbDistance(hexToRgb(a), hexToRgb(b));

/** Nombre sugerido para un color detectado, según su tono y luminosidad. */
export function suggestColorName(hex: string): string {
  const [r, g, b] = hexToRgb(hex);
  const max = Math.max(r, g, b) / 255, min = Math.min(r, g, b) / 255;
  const light = (max + min) / 2;
  const delta = max - min;
  let hue = 0;
  if (delta > 0) {
    if (max === r / 255) hue = ((g - b) / 255 / delta) % 6;
    else if (max === g / 255) hue = (b - r) / 255 / delta + 2;
    else hue = (r - g) / 255 / delta + 4;
    hue = (hue * 60 + 360) % 360;
  }
  let base: string;
  if (delta < 0.12) {
    if (light > 0.93) base = 'Blanco';
    else if (light > 0.72) base = 'Gris claro';
    else if (light > 0.38) base = 'Gris';
    else if (light > 0.14) base = 'Gris oscuro';
    else base = 'Negro';
  } else if (hue < 15 || hue >= 345) base = 'Rojo';
  else if (hue < 40) base = 'Naranja';
  else if (hue < 68) base = 'Amarillo';
  else if (hue < 150) base = 'Verde';
  else if (hue < 190) base = 'Turquesa';
  else if (hue < 220) base = 'Celeste';
  else if (hue < 250) base = 'Azul';
  else if (hue < 290) base = 'Violeta';
  else base = 'Rosa';
  if (delta < 0.12) return base;
  if (light > 0.78) return `${base} claro`;
  if (light < 0.35) return `${base} oscuro`;
  return base;
}

/** Evita dos colores con el mismo nombre al crear uno automáticamente. */
export function uniqueColorName(base: string, existing: ColorT[]): string {
  const used = new Set(existing.map(c => c.name.trim().toLowerCase()));
  if (!used.has(base.toLowerCase())) return base;
  let i = 2;
  while (used.has(`${base} ${i}`.toLowerCase())) i++;
  return `${base} ${i}`;
}

/** Elige centros bien separados para que el k-means sea estable. */
function initialCenters(pixels: RGB[], k: number): RGB[] {
  const centers: RGB[] = [pixels[Math.floor(pixels.length / 2)]];
  while (centers.length < k) {
    let best = pixels[0], bestDistance = -1;
    for (let i = 0; i < pixels.length; i += 3) {
      const p = pixels[i];
      const d = Math.min(...centers.map(c => rgbDistance(p, c)));
      if (d > bestDistance) { bestDistance = d; best = p; }
    }
    centers.push(best);
  }
  return centers;
}

/**
 * Detecta los colores dominantes de una foto en el navegador.
 * Descarta el fondo uniforme (bordes de la imagen) y agrupa los pixeles por similitud.
 * Devuelve hasta `maxColors` colores en hexadecimal, ordenados por predominio.
 */
export async function extractPalette(file: File, maxColors = 6): Promise<string[]> {
  const bitmap = await createImageBitmap(file, {
    resizeWidth: 150,
    resizeHeight: 150,
    resizeQuality: 'medium',
  });
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) { bitmap.close(); throw new Error('No se pudo leer la imagen'); }
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();

  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels: RGB[] = [];
  const border: RGB[] = [];
  for (let y = 0; y < canvas.height; y += 2) {
    for (let x = 0; x < canvas.width; x += 2) {
      const i = (y * canvas.width + x) * 4;
      if (data[i + 3] < 128) continue;
      const rgb: RGB = [data[i], data[i + 1], data[i + 2]];
      pixels.push(rgb);
      if (x < 8 || x >= canvas.width - 8 || y < 8 || y >= canvas.height - 8) border.push(rgb);
    }
  }
  if (pixels.length < 20) throw new Error('La imagen es demasiado chica para detectar colores');

  // Color de fondo aproximado: promedio de los bordes de la foto.
  const bg: RGB = border.length
    ? [0, 1, 2].map(i => border.reduce((sum, p) => sum + p[i], 0) / border.length) as RGB
    : [255, 255, 255];
  const foreground = pixels.filter(p => colorDistance(rgbToHex(p), rgbToHex(bg)) > 45);
  const sample = foreground.length > pixels.length * 0.15 ? foreground : pixels;

  const k = Math.min(8, Math.max(2, Math.floor(sample.length / 120)));
  let centers = initialCenters(sample, k);
  let buckets: RGB[][] = centers.map(() => []);
  for (let iteration = 0; iteration < 12; iteration++) {
    buckets = centers.map(() => []);
    for (const p of sample) {
      let nearest = 0, best = Infinity;
      for (let c = 0; c < centers.length; c++) {
        const d = rgbDistance(p, centers[c]);
        if (d < best) { best = d; nearest = c; }
      }
      buckets[nearest].push(p);
    }
    let shift = 0;
    centers = centers.map((center, c) => {
      const group = buckets[c];
      if (!group.length) return center;
      const next = [0, 1, 2].map(i => group.reduce((sum, p) => sum + p[i], 0) / group.length) as RGB;
      shift = Math.max(shift, colorDistance(rgbToHex(center), rgbToHex(next)));
      return next;
    });
    if (shift < 2) break;
  }

  const clusters = centers
    .map((center, i) => ({ hex: rgbToHex(center), count: buckets[i].length }))
    .filter(c => c.count >= sample.length * 0.02)
    .sort((a, b) => b.count - a.count);

  const merged: typeof clusters = [];
  for (const cluster of clusters) {
    if (merged.some(c => colorDistance(c.hex, cluster.hex) < 45)) continue;
    if (colorDistance(cluster.hex, rgbToHex(bg)) < 50 && merged.length === 0) continue;
    merged.push(cluster);
  }
  return merged.slice(0, maxColors).map(c => c.hex);
}
