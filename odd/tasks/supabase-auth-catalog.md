Objective: Reemplazar autenticación JWT y consultas Spring Boot por Supabase Auth/PostgREST en el frontend.
Branch: main (sin commits solicitados). Delivery: inline. Test runner: `npm run build`.
Mirror: Engram unavailable; local file is source of truth.

## Specs

S1 (section 2). Crear `frontend/src/api/supabaseClient.ts` con exactamente:

```ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las variables de entorno de Supabase en el frontend')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

S2 (section 3). Reemplazar por completo `frontend/src/context/AuthContext.tsx` con exactamente:

```ts
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../api/supabaseClient';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, pass: string) => Promise<any>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};
```

S3 (section 4). Modificar `frontend/src/api/client.ts` con exactamente:

```ts
import { supabase } from './supabaseClient';

export async function getCategories() {
  const { data, error } = await supabase.from('categories').select('*').order('name');
  if (error) throw error;
  return data;
}

export async function getProducts(categoryId?: string) {
  let query = supabase.from('products').select('*, categories(*), colors(*)');
  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*), colors(*)')
    .eq('slug', slug)
    .single();
  if (error) throw error;
  return data;
}

export async function getColors() {
  const { data, error } = await supabase.from('colors').select('*');
  if (error) throw error;
  return data;
}

export async function getSiteSettings() {
  const { data, error } = await supabase.from('site_settings').select('*').single();
  if (error) throw error;
  return data;
}
```

S4 (section 5). Crear o editar `frontend/.env` con exactamente:

```env
VITE_SUPABASE_URL=https://dalluwzbtnxwoqtsjmwm.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anon_public_aqui
```

La clave real indicada por el usuario para reemplazar `tu_clave_anon_public_aqui`: `sb_publishable_E2iLgwChJ5TmWe1alkG9Yw_aBJFytTF`.

## Tasks

- T1 (S1, S4) — Crear `supabaseClient.ts` y `.env`; verificar dependencia instalada. Route: inline. Status: done. Commit: none requested.
- T2 (S2) — Reemplazar `AuthContext.tsx` por el contenido dado. Route: inline. Status: done. Commit: none requested.
- T3 (S3) — Reemplazar `client.ts` por el contenido dado y preservar el helper HTTP anterior en `httpClient.ts` para admin/imágenes. Route: inline. Status: done. Commit: none requested.
- T4 (S2, S3) — Adaptar consumidores (`hooks.ts`, `LoginPage.tsx`, `Layout.tsx`, `RequireAdmin.tsx`, `ProductVisual.tsx`, páginas admin, `lib.ts`). Route: inline. Status: done. Commit: none requested.
- T5 (all) — Ejecutar `npx tsc --noEmit` y `npm run build`; registrar resultados. Route: inline. Status: done (build OK). Commit: none requested.

## Log

L1 (user request verbatim):

Crear el cliente de Supabase
Crea un nuevo archivo en frontend/src/api/supabaseClient.ts:

TypeScript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las variables de entorno de Supabase en el frontend')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
3. Actualizar el contexto de autenticación (AuthContext.tsx)
Reemplaza por completo el contenido de frontend/src/context/AuthContext.tsx para usar la autenticación nativa de Supabase (que reemplaza el JWT y los controladores de login anteriores):

TypeScript
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../api/supabaseClient';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, pass: string) => Promise<any>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};
4. Actualizar el cliente API de la tienda (client.ts)
Modifica frontend/src/api/client.ts para que las consultas a productos, categorías, colores y configuraciones se realicen directamente contra las tablas de Supabase en lugar de hacer peticiones fetch a tu API de Spring Boot:

TypeScript
import { supabase } from './supabaseClient';

export async function getCategories() {
  const { data, error } = await supabase.from('categories').select('*').order('name');
  if (error) throw error;
  return data;
}

export async function getProducts(categoryId?: string) {
  let query = supabase.from('products').select('*, categories(*), colors(*)');
  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*), colors(*)')
    .eq('slug', slug)
    .single();
  if (error) throw error;
  return data;
}

export async function getColors() {
  const { data, error } = await supabase.from('colors').select('*');
  if (error) throw error;
  return data;
}

export async function getSiteSettings() {
  const { data, error } = await supabase.from('site_settings').select('*').single();
  if (error) throw error;
  return data;
}
5. Configurar las variables de entorno en el Frontend
Crea o edita el archivo .env en la raíz de la carpeta frontend/:

Fragmento de código
VITE_SUPABASE_URL=https://dalluwzbtnxwoqtsjmwm.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anon_public_aqui
(Reemplaza tu_clave_anon_public_aqui por la clave anon / public que copiaste de tu panel de Supabase en el menú API Keys).

esta es la clave: sb_publishable_E2iLgwChJ5TmWe1alkG9Yw_aBJFytTF
