import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCategories, getColors, getProductBySlug, getProducts, getSiteSettings } from './client';
import type { Category, ColorT, Product, Settings } from '../types';

// Trae la lista de categorías del catálogo.
export const useCategories = () => useQuery<Category[]>({ queryKey: ['categories'], queryFn: async () => (await getCategories()) as Category[] });
// Trae la lista de colores que se pueden usar en los productos.
export const useColors = () => useQuery<ColorT[]>({ queryKey: ['colors'], queryFn: async () => (await getColors()) as ColorT[] });
// Trae los datos del local: WhatsApp, dirección y horarios.
export const useSettings = () => useQuery<Settings>({ queryKey: ['settings'], queryFn: async () => (await getSiteSettings()) as Settings });
// Trae todos los productos del catálogo.
export const useProducts = () => useQuery<Product[]>({ queryKey: ['products'], queryFn: async () => (await getProducts()) as Product[] });
// Trae un solo producto por su slug; no reintenta si no lo encuentra.
export const useProduct = (slug: string) =>
  useQuery<Product | null>({ queryKey: ['product', slug], queryFn: () => getProductBySlug(slug), retry: false });

/** Refresca todo el catálogo después de un cambio en el panel de administración. */
export function useRefreshCatalog() {
  // Accede a los datos que la app tiene guardados del backend.
  const qc = useQueryClient();
  // Marca esos datos como viejos para que se vuelvan a cargar.
  return () => qc.invalidateQueries();
}
