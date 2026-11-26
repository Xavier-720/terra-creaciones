// Respaldo local del estado "destacado" cuando Supabase no permite escribir.
// Así el inicio y el panel siguen coincidiendo en este dispositivo.
const KEY = 'terra-featured-overrides';

type Overrides = Record<string, boolean>;

const read = (): Overrides => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Overrides) : {};
  } catch {
    return {};
  }
};

export const getFeaturedOverride = (id: number): boolean | undefined => read()[String(id)];

export const setFeaturedOverride = (id: number, value: boolean) => {
  try {
    const overrides = read();
    overrides[String(id)] = value;
    localStorage.setItem(KEY, JSON.stringify(overrides));
  } catch {
    // Sin almacenamiento, el cambio sigue funcionando durante la sesión.
  }
};
