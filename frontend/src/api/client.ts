import { supabase } from './supabaseClient';
import { EXTRA_COLORS } from '../colors';
import { SHOWCASE_EXAMPLES } from '../examples';
import { getFeaturedOverride, setFeaturedOverride } from '../featuredOverride';
import type { Category, ColorT, Product, Settings, Shape } from '../types';

// Normaliza texto para crear slugs legibles en URL (ej: "Bolsos de mano" -> "bolsos-de-mano")
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Adapta los registros de PostgREST de Supabase al formato que esperan los componentes del frontend
export function mapProduct(row: any): Product {
  const cat = row.categories || row.category;
  const category: Category = cat
    ? {
        id: Number(cat.id ?? row.category_id),
        slug: cat.slug ?? '',
        name: cat.name ?? '',
        emoji: cat.emoji ?? '',
      }
    : {
        id: Number(row.category_id ?? 0),
        slug: '',
        name: '',
        emoji: '',
      };

  let features: string[] = [];
  if (Array.isArray(row.product_features)) {
    features = [...row.product_features]
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map(f => f.feature)
      .filter(Boolean);
  } else if (Array.isArray(row.features)) {
    features = row.features;
  }

  let colors: ColorT[] = [];
  if (Array.isArray(row.product_colors)) {
    colors = [...row.product_colors]
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map(pc => pc.colors || pc.color)
      .filter((c): c is ColorT => Boolean(c && c.id));
  } else if (Array.isArray(row.colors)) {
    colors = row.colors;
  }

  return {
    id: Number(row.id),
    slug: row.slug,
    name: row.name,
    description: row.description ?? '',
    shape: (row.shape as Shape) ?? 'BAG',
    imageUrl: row.image_url ?? row.imageUrl ?? null,
    featured: Boolean(row.featured),
    category,
    colors,
    features,
  };
}

const PRODUCT_SELECT = `
  id,
  slug,
  name,
  description,
  shape,
  image_url,
  featured,
  category_id,
  categories ( id, slug, name, emoji ),
  product_features ( position, feature ),
  product_colors ( position, colors ( id, name, hex ) )
`;

// --- Consultas del Catálogo ---

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from('categories').select('*').order('name');
  if (error) throw error;
  return (data ?? []).map(c => ({
    id: Number(c.id),
    slug: c.slug,
    name: c.name,
    emoji: c.emoji ?? '',
  }));
}

export async function getProducts(categoryId?: string | number): Promise<Product[]> {
  let query = supabase.from('products').select(PRODUCT_SELECT).order('id');
  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(row => {
    const product = mapProduct(row);
    const override = getFeaturedOverride(product.id);
    return override === undefined ? product : { ...product, featured: override };
  });
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return mapProduct(data);
}

export async function getColors(): Promise<ColorT[]> {
  const { data, error } = await supabase.from('colors').select('*').order('id');
  if (error) throw error;
  return (data ?? []).map(c => ({
    id: Number(c.id),
    name: c.name,
    hex: c.hex,
  }));
}

export async function getSiteSettings(): Promise<Settings> {
  const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle();
  if (error) throw error;
  if (!data) {
    return {
      whatsapp: '5490000000000',
      address: '[Dirección del local], [Ciudad]',
      hours: 'Lunes a sábados, 9 a 13 h y 16 a 20 h',
    };
  }
  return {
    whatsapp: data.whatsapp ?? '',
    address: data.address ?? '',
    hours: data.hours ?? '',
  };
}

// --- Operaciones de Administración (CRUD directo en Supabase) ---

// Categorías
export async function createCategory(input: { name: string; emoji: string }): Promise<Category> {
  const baseSlug = slugify(input.name) || 'categoria';
  const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
  const { data, error } = await supabase
    .from('categories')
    .insert([{ name: input.name.trim(), emoji: input.emoji.trim(), slug }])
    .select()
    .single();
  if (error) throw error;
  return { id: Number(data.id), slug: data.slug, name: data.name, emoji: data.emoji ?? '' };
}

export async function updateCategory(id: number, input: { name: string; emoji: string }): Promise<void> {
  const { error } = await supabase
    .from('categories')
    .update({ name: input.name.trim(), emoji: input.emoji.trim() })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteCategory(id: number): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}

// Colores
export async function createColor(input: { name: string; hex: string }): Promise<ColorT> {
  const { data, error } = await supabase
    .from('colors')
    .insert([{ name: input.name.trim(), hex: input.hex.trim() }])
    .select()
    .single();
  if (error) throw error;
  return { id: Number(data.id), name: data.name, hex: data.hex };
}

export async function updateColor(id: number, input: { name: string; hex: string }): Promise<void> {
  const { error } = await supabase
    .from('colors')
    .update({ name: input.name.trim(), hex: input.hex.trim() })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteColor(id: number): Promise<void> {
  const { error } = await supabase.from('colors').delete().eq('id', id);
  if (error) throw error;
}

/** Carga la paleta extendida sin repetir colores que ya existen. Devuelve cuántos agregó. */
export async function ensureDefaultColors(): Promise<number> {
  const existing = await getColors();
  const used = new Set(existing.map(c => c.name.trim().toLowerCase()));
  const missing = EXTRA_COLORS.filter(c => !used.has(c.name.toLowerCase()));
  if (!missing.length) return 0;
  const { error } = await supabase.from('colors').insert(missing.map(c => ({ name: c.name, hex: c.hex })));
  if (error) throw error;
  return missing.length;
}

// Configuración del sitio
export async function updateSiteSettings(settings: Settings): Promise<void> {
  const { error } = await supabase.from('site_settings').upsert({
    id: 1,
    whatsapp: settings.whatsapp.trim(),
    address: settings.address.trim(),
    hours: settings.hours.trim(),
  });
  if (error) throw error;
}

// Productos
export interface ProductDraftInput {
  name: string;
  description: string;
  features: string[];
  shape: Shape;
  imageUrl: string | null;
  featured: boolean;
  categoryId: number;
  colorIds: number[];
}

export async function createProduct(input: ProductDraftInput): Promise<Product> {
  const baseSlug = slugify(input.name) || 'producto';
  let slug = baseSlug;

  const { data: existing } = await supabase.from('products').select('id').eq('slug', slug).maybeSingle();
  if (existing) {
    slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
  }

  const { data: p, error: pError } = await supabase
    .from('products')
    .insert([{
      name: input.name.trim(),
      slug,
      description: input.description.trim(),
      shape: input.shape,
      image_url: input.imageUrl,
      featured: input.featured,
      category_id: input.categoryId,
    }])
    .select()
    .single();
  if (pError) throw pError;

  const productId = p.id;

  const cleanFeatures = input.features.map(f => f.trim()).filter(Boolean);
  if (cleanFeatures.length > 0) {
    const featRows = cleanFeatures.map((feature, position) => ({
      product_id: productId,
      position,
      feature,
    }));
    const { error: featError } = await supabase.from('product_features').insert(featRows);
    if (featError) throw featError;
  }

  if (input.colorIds.length > 0) {
    const colRows = input.colorIds.map((color_id, position) => ({
      product_id: productId,
      position,
      color_id,
    }));
    const { error: colorError } = await supabase.from('product_colors').insert(colRows);
    if (colorError) throw colorError;
  }

  const res = await getProductBySlug(slug);
  if (!res) throw new Error('No se pudo cargar el producto creado');
  return res;
}

export async function updateProduct(id: number, input: ProductDraftInput): Promise<void> {
  const { error: pError } = await supabase
    .from('products')
    .update({
      name: input.name.trim(),
      description: input.description.trim(),
      shape: input.shape,
      image_url: input.imageUrl,
      featured: input.featured,
      category_id: input.categoryId,
    })
    .eq('id', id);
  if (pError) throw pError;

  // Actualizar características
  const { error: deleteFeaturesError } = await supabase.from('product_features').delete().eq('product_id', id);
  if (deleteFeaturesError) throw deleteFeaturesError;
  const cleanFeatures = input.features.map(f => f.trim()).filter(Boolean);
  if (cleanFeatures.length > 0) {
    const featRows = cleanFeatures.map((feature, position) => ({
      product_id: id,
      position,
      feature,
    }));
    const { error: featError } = await supabase.from('product_features').insert(featRows);
    if (featError) throw featError;
  }

  // Actualizar colores
  const { error: deleteColorsError } = await supabase.from('product_colors').delete().eq('product_id', id);
  if (deleteColorsError) throw deleteColorsError;
  if (input.colorIds.length > 0) {
    const colRows = input.colorIds.map((color_id, position) => ({
      product_id: id,
      position,
      color_id,
    }));
    const { error: colorError } = await supabase.from('product_colors').insert(colRows);
    if (colorError) throw colorError;
  }
}

export async function deleteProduct(id: number): Promise<void> {
  const { error: featuresError } = await supabase.from('product_features').delete().eq('product_id', id);
  if (featuresError) throw featuresError;
  const { error: colorsError } = await supabase.from('product_colors').delete().eq('product_id', id);
  if (colorsError) throw colorsError;
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

export type FeaturedUpdate = { source: 'supabase' | 'local' };

export async function toggleProductFeatured(id: number, currentFeatured: boolean): Promise<FeaturedUpdate> {
  const expected = !currentFeatured;
  // `.select()` permite detectar cuando RLS bloquea el UPDATE y no modifica filas.
  try {
    const { data, error } = await supabase
      .from('products')
      .update({ featured: expected })
      .eq('id', id)
      .select('id, featured');
    if (!error && data?.length && data[0].featured === expected) return { source: 'supabase' };
  } catch {
    // Si falla la red, igual aplicamos el respaldo local.
  }
  setFeaturedOverride(id, expected);
  return { source: 'local' };
}

// Subida de imágenes a Supabase Storage con fallback a base64
export async function uploadProductImage(file: File): Promise<string> {
  try {
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const bucket = 'product-images';

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (!uploadError) {
      const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
      if (data?.publicUrl) return data.publicUrl;
    } else {
      console.warn('Storage upload error, usando fallback base64:', uploadError.message);
    }
  } catch (err) {
    console.warn('Error en storage, usando fallback base64:', err);
  }

  // Fallback a Base64 si el bucket todavía no fue creado en Supabase
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** Completa el catálogo con 12 ejemplos y marca destacados hasta llegar a 12. */
export async function ensureShowcaseExamples(): Promise<number> {
  const [products, categories, colors] = await Promise.all([getProducts(), getCategories(), getColors()]);
  const categoryIds = new Map(categories.map(c => [c.slug, c.id]));
  const colorIds = new Map(colors.map(c => [c.name.toLowerCase(), c.id]));
  let added = 0;

  for (const example of SHOWCASE_EXAMPLES) {
    if (products.some(p => p.slug === example.slug)) continue;
    const categoryId = categoryIds.get(example.category);
    if (!categoryId) continue;
    const { data, error } = await supabase
      .from('products')
      .insert([{
        slug: example.slug,
        name: example.name,
        description: example.description,
        shape: example.shape,
        featured: true,
        category_id: categoryId,
      }])
      .select()
      .single();
    if (error) throw error;
    const productId = Number(data.id);

    if (example.features.length) {
      const { error: featError } = await supabase.from('product_features').insert(
        example.features.map((feature, position) => ({ product_id: productId, position, feature })),
      );
      if (featError) throw featError;
    }
    const colorRows = example.colors
      .map((name, position) => ({ product_id: productId, position, color_id: colorIds.get(name.toLowerCase()) }))
      .filter((row): row is { product_id: number; position: number; color_id: number } => row.color_id !== undefined);
    if (colorRows.length) {
      const { error: colorError } = await supabase.from('product_colors').insert(colorRows);
      if (colorError) throw colorError;
    }
    setFeaturedOverride(Number(data.id), true);
    added++;
  }

  // Asegura que los 12 ejemplos estén marcados como destacados (lo mismo que muestra el inicio).
  const all = await getProducts();
  for (const example of SHOWCASE_EXAMPLES) {
    const product = all.find(p => p.slug === example.slug);
    if (!product || product.featured) continue;
    setFeaturedOverride(product.id, true);
    const { error } = await supabase.from('products').update({ featured: true }).eq('id', product.id);
    if (error) throw error;
  }
  return added;
}
