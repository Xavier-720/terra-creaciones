// Formas de dibujo que puede tener un producto cuando no tiene foto.
export type Shape = 'BAG' | 'WALLET' | 'TOY' | 'COASTER' | 'BALL';
// Nombre en español de cada forma.
export const SHAPES: Record<Shape, string> = {
  BAG: 'Bolso',
  WALLET: 'Cartera',
  TOY: 'Amigurumi',
  COASTER: 'Posavasos',
  BALL: 'Ovillo / otro',
};

// Una categoría del catálogo, como bolsos o carteras.
export interface Category { id: number; slug: string; name: string; emoji: string }
// Un color con su nombre y su código para la web.
export interface ColorT { id: number; name: string; hex: string }
// Un producto tejido con sus datos, su foto, sus colores y su categoría.
export interface Product {
  id: number; slug: string; name: string; description: string; features: string[];
  shape: Shape; imageUrl: string | null; featured: boolean; category: Category; colors: ColorT[];
}
// Datos de contacto y horarios del local.
export interface Settings { whatsapp: string; address: string; hours: string }
// Una persona que usa la página, con su nombre y su rol.
export interface User { id: number; email: string; name: string; role: 'USER' | 'ADMIN' }
// Respuesta del ingreso: token para entrar y datos de la persona.
export interface AuthResponse { token: string; user: User }
