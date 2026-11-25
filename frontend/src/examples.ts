import type { Shape } from './types';

/** Productos de muestra usados para completar la sección Destacados. */
export interface ShowcaseExample {
  slug: string;
  name: string;
  description: string;
  shape: Shape;
  category: string;
  features: string[];
  colors: string[];
}

export const SHOWCASE_EXAMPLES: ShowcaseExample[] = [
  {
    slug: 'bolso-sol', name: 'Bolso Sol', shape: 'BAG', category: 'bolsos',
    description: 'Bolso grande tejido en punto rombo, ideal para el día a día. Asas reforzadas.',
    features: ['Material: algodón (ejemplo)', 'Medidas: 32 x 28 cm (ejemplo)'],
    colors: ['Manteca', 'Crema', 'Durazno'],
  },
  {
    slug: 'bolso-mar', name: 'Bolso Mar', shape: 'BAG', category: 'bolsos',
    description: 'Tote liviano con franjas suaves, forrado por dentro con cierre.',
    features: ['Con forro interno y cierre'],
    colors: ['Celeste', 'Menta', 'Crema'],
  },
  {
    slug: 'bolso-flor', name: 'Bolso Flor', shape: 'BAG', category: 'bolsos',
    description: 'Bolso con flores aplicadas a mano en cada costado.',
    features: ['Flores aplicadas a mano'],
    colors: ['Rosa', 'Lila', 'Crema', 'Salvia'],
  },
  {
    slug: 'cartera-nube', name: 'Cartera Nube', shape: 'WALLET', category: 'carteras',
    description: 'Cartera chica con solapa y cierre magnético, entra lo justo y necesario.',
    features: ['Cierre magnético'],
    colors: ['Lila', 'Blanco roto'],
  },
  {
    slug: 'cartera-durazno', name: 'Cartera Durazno', shape: 'WALLET', category: 'carteras',
    description: 'Cartera mediana con correa larga para llevar cruzada.',
    features: ['Correa larga ajustable'],
    colors: ['Durazno', 'Crema', 'Salvia'],
  },
  {
    slug: 'cartera-brisa', name: 'Cartera Brisa', shape: 'WALLET', category: 'carteras',
    description: 'Monedero y tarjetero en una sola pieza, tejido compacto.',
    features: ['Compartimentos para tarjetas'],
    colors: ['Celeste', 'Blanco roto'],
  },
  {
    slug: 'llavero-osito', name: 'Llavero Osito', shape: 'TOY', category: 'otros',
    description: 'Amigurumi de 7 cm con argolla metálica. Se pide por color.',
    features: ['Altura: 7 cm'],
    colors: ['Durazno', 'Crema', 'Rosa'],
  },
  {
    slug: 'posavasos-flor', name: 'Posavasos Flor', shape: 'COASTER', category: 'otros',
    description: 'Set de 4 posavasos en forma de flor, lavables.',
    features: ['Set de 4 unidades'],
    colors: ['Manteca', 'Menta', 'Rosa', 'Lila'],
  },
  {
    slug: 'bolso-luna', name: 'Bolso Luna', shape: 'BAG', category: 'bolsos',
    description: 'Bolso redondo con detalle de luna bordada y cadena delicada.',
    features: ['Cierre con broche', 'Medidas: 24 x 24 cm (ejemplo)'],
    colors: ['Lila', 'Crema', 'Plata'],
  },
  {
    slug: 'cartera-petalo', name: 'Cartera Pétalo', shape: 'WALLET', category: 'carteras',
    description: 'Cartera de solapa redondeada con flores diminutas tejidas.',
    features: ['Forro de algodón', 'Cierre magnético'],
    colors: ['Rosa', 'Crema', 'Salvia'],
  },
  {
    slug: 'amigurumi-flor', name: 'Amigurumi Flor', shape: 'TOY', category: 'otros',
    description: 'Flor tejida a mano con tallo flexible, ideal como regalo.',
    features: ['Altura: 12 cm (ejemplo)'],
    colors: ['Manteca', 'Rosa', 'Menta'],
  },
  {
    slug: 'posavasos-duo', name: 'Set Posavasos Duo', shape: 'COASTER', category: 'otros',
    description: 'Dos posavasos translatorios con espiral en tonos suaves.',
    features: ['Set de 2 unidades', 'Lavables a mano'],
    colors: ['Celeste', 'Crema', 'Durazno'],
  },
];
