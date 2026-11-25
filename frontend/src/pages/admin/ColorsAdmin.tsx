import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createColor, updateColor, deleteColor, ensureDefaultColors } from '../../api/client';
import { useColors, useRefreshCatalog } from '../../api/hooks';
import { EXTRA_COLORS } from '../../colors';
import type { ColorT } from '../../types';
import ConfirmButton from './ConfirmButton';

// Tamaño del recuadro que sirve para elegir un color.
const colorInput = { width: 56, height: 44, padding: 2 } as const;

// Muestra un color con sus campos para editarlo o eliminarlo.
function Row({ color, onError, onDone }: { color: ColorT; onError: (e: unknown) => void; onDone: (m: string) => void }) {
  const refresh = useRefreshCatalog();
  const [name, setName] = useState(color.name);
  const [hex, setHex] = useState(color.hex);

  const save = useMutation({
    mutationFn: () => updateColor(color.id, { name, hex }),
    onSuccess: () => { onDone('Color guardado.'); refresh(); },
    onError,
  });

  const remove = useMutation({
    mutationFn: () => deleteColor(color.id),
    onSuccess: () => { onDone('Color eliminado.'); refresh(); },
    onError,
  });

  return (
    <div className="item">
      <input type="color" style={colorInput} aria-label="Color" value={hex} onChange={e => setHex(e.target.value)} />
      <input className="grow" aria-label="Nombre" value={name} onChange={e => setName(e.target.value)} />
      <button type="button" className="sm" disabled={!name.trim() || save.isPending} onClick={() => save.mutate()}>Guardar</button>
      <ConfirmButton onConfirm={() => remove.mutate()}>Eliminar</ConfirmButton>
    </div>
  );
}

// Gestiona la paleta de colores y permite agregar uno nuevo.
export default function ColorsAdmin() {
  const colors = useColors();
  const refresh = useRefreshCatalog();
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [hex, setHex] = useState('#d9c4a8');

  const fail = (e: unknown) => setMessage(e instanceof Error ? e.message : 'Ocurrió un error');

  const add = useMutation({
    mutationFn: () => createColor({ name, hex }),
    onSuccess: () => { setName(''); setMessage('Color agregado.'); refresh(); },
    onError: fail,
  });

  // Carga de una vez la paleta amplia (sin repetir los que ya existen).
  const loadPalette = useMutation({
    mutationFn: ensureDefaultColors,
    onSuccess: (count) => {
      setMessage(count ? `Se agregaron ${count} colores a la paleta.` : 'La paleta amplia ya está completa.');
      refresh();
    },
    onError: fail,
  });

  return (
    <>
      <p style={{ margin: '6px 0 14px' }}>Estos son los colores disponibles para asignar a cada producto. Al subir una foto, el panel detecta la paleta automáticamente; acá podés cargar la paleta amplia y corregirla a mano.</p>
      <div className="row" style={{ marginBottom: 14 }}>
        <button type="button" className="sm" disabled={loadPalette.isPending} onClick={() => loadPalette.mutate()}>
          {loadPalette.isPending ? 'Cargando paleta…' : `Agregar paleta amplia (${EXTRA_COLORS.length} colores)`}
        </button>
      </div>
      {message && <p className="msg" aria-live="polite">{message}</p>}
      {colors.data?.map(c => <Row key={`${c.id}-${c.name}-${c.hex}`} color={c} onError={fail} onDone={setMessage} />)}
      <div className="item">
        <input type="color" style={colorInput} aria-label="Color" value={hex} onChange={e => setHex(e.target.value)} />
        <input className="grow" placeholder="Nuevo color (nombre)" aria-label="Nombre" value={name} onChange={e => setName(e.target.value)} />
        <button type="button" className="sm" disabled={!name.trim() || add.isPending} onClick={() => add.mutate()}>Agregar</button>
      </div>
    </>
  );
}
