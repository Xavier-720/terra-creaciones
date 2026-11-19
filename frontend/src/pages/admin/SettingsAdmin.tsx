import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { updateSiteSettings } from '../../api/client';
import { useRefreshCatalog, useSettings } from '../../api/hooks';
import type { Settings } from '../../types';

// Formulario para editar el WhatsApp, la dirección y los horarios del local.
export default function SettingsAdmin() {
  const { data } = useSettings();
  const refresh = useRefreshCatalog();
  const [form, setForm] = useState<Settings>({ whatsapp: '', address: '', hours: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const save = useMutation({
    mutationFn: () => updateSiteSettings(form),
    onSuccess: () => { setMessage('Datos guardados en Supabase.'); refresh(); },
    onError: (e) => setMessage(e instanceof Error ? e.message : 'Ocurrió un error'),
  });

  return (
    <>
      <label>WhatsApp (con código de país, solo números)
        <input value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} />
      </label>
      <label>Dirección del local
        <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
      </label>
      <label>Horarios
        <input value={form.hours} onChange={e => setForm({ ...form, hours: e.target.value })} />
      </label>
      {message && <p className="msg" aria-live="polite">{message}</p>}
      <button type="button" className="btn" disabled={save.isPending} onClick={() => save.mutate()}>
        Guardar cambios
      </button>
    </>
  );
}
