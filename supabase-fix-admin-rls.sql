-- ==============================================================================
-- ADMIN: permisos de escritura y destacados - TERRA CREACIONES
-- ==============================================================================
-- Si los botones "Mostrar/Sacar del inicio" no persisten el cambio, Supabase
-- está bloqueando el UPDATE por RLS (no devuelve error, solo 0 filas).
-- 1) Ejecutá este script en el SQL Editor de Supabase.
-- 2) Reemplazá 'tu_email@ejemplo.com' por el email con el que entrás a la web.
-- 3) Cerrá sesión en la web y volvé a ingresar para que el JWT traiga el rol.
-- ==============================================================================

-- 1. Asegurar el rol ADMIN en el usuario (app_metadata viaja en el JWT).
UPDATE auth.users
SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || '{"role": "ADMIN"}'::jsonb
WHERE email = 'xavier.cuevas.xc@gmail.com';

-- 2. Función única para chequear el rol desde el JWT.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE((auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN', false)
      OR COALESCE((auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN', false);
$$;

-- 3. Recrear las políticas de escritura de las tablas del catálogo.
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['categories', 'colors', 'products', 'product_features', 'product_colors', 'site_settings']
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Admin write %I" ON public.%I', t, t);
    EXECUTE format($f$
      CREATE POLICY "Admin write %I" ON public.%I
      FOR ALL TO authenticated
      USING (public.is_admin())
      WITH CHECK (public.is_admin())
    $f$, t, t);
  END LOOP;
END $$;

-- 4. Verificación: debe devolver el rol del usuario (ejecutarlo ya logueado no es
--    posible desde el SQL Editor, pero la web debería permitir guardar después del re-login).
SELECT id, email, raw_app_meta_data ->> 'role' AS role
FROM auth.users
WHERE email = 'tu_email@ejemplo.com';
