import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createCategory, updateCategory, deleteCategory } from '../../api/client';
import { useCategories, useRefreshCatalog } from '../../api/hooks';
import type { Category } from '../../types';
import ConfirmButton from './ConfirmButton';

const EMOJI_OPTIONS = [
  '🧶', '👜', '👛', '🎒', '🧸', '🧣', '🧺', '🌸', '☕', '🎁', '✨', '👒', '🎀', '🪡', '🧵', '🌷'
];

// Muestra una categoría con sus campos para editarla o eliminarla.
function Row({ category, onError, onDone }: { category: Category; onError: (e: unknown) => void; onDone: (m: string) => void }) {
  const refresh = useRefreshCatalog();
  const [name, setName] = useState(category.name);
  const [emoji, setEmoji] = useState(category.emoji || '🧶');
  const [showPicker, setShowPicker] = useState(false);

  const save = useMutation({
    mutationFn: () => updateCategory(category.id, { name, emoji }),
    onSuccess: () => { onDone('Categoría guardada.'); refresh(); },
    onError,
  });

  const remove = useMutation({
    mutationFn: () => deleteCategory(category.id),
    onSuccess: () => { onDone('Categoría eliminada.'); refresh(); },
    onError,
  });

  return (
    <div style={{ marginBottom: 12 }}>
      <div className="item">
        <button
          type="button"
          className="sm emoji-toggle"
          style={{ fontSize: '1.4rem', padding: '4px 10px', minWidth: 46 }}
          title="Cambiar ícono"
          onClick={() => setShowPicker(!showPicker)}
        >
          {emoji || '🧶'}
        </button>
        <input
          style={{ width: 60, textAlign: 'center' }}
          aria-label="Emoji"
          value={emoji}
          onChange={e => setEmoji(e.target.value)}
        />
        <input
          className="grow"
          aria-label="Nombre"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button
          type="button"
          className="sm"
          disabled={!name.trim() || save.isPending}
          onClick={() => save.mutate()}
        >
          Guardar
        </button>
        <ConfirmButton onConfirm={() => remove.mutate()}>Eliminar</ConfirmButton>
      </div>

      {showPicker && (
        <div style={{
          display: 'flex',
          gap: 6,
          flexWrap: 'wrap',
          background: 'var(--card)',
          border: '1px solid var(--line)',
          borderRadius: 12,
          padding: 8,
          margin: '-4px 0 10px 10px'
        }}>
          {EMOJI_OPTIONS.map(em => (
            <button
              key={em}
              type="button"
              className="sm"
              style={{
                fontSize: '1.25rem',
                padding: '4px 8px',
                background: emoji === em ? 'var(--lil)' : undefined,
                border: emoji === em ? '2px solid var(--ac)' : undefined,
              }}
              onClick={() => {
                setEmoji(em);
                setShowPicker(false);
              }}
            >
              {em}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Gestiona la lista de categorías y permite agregar una nueva.
export default function CategoriesAdmin() {
  const categories = useCategories();
  const refresh = useRefreshCatalog();
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('👜');

  const fail = (e: unknown) => setMessage(e instanceof Error ? e.message : 'Ocurrió un error');

  const add = useMutation({
    mutationFn: () => createCategory({ name, emoji }),
    onSuccess: () => {
      setName('');
      setEmoji('👜');
      setMessage('Categoría creada exitosamente.');
      refresh();
    },
    onError: fail,
  });

  return (
    <>
      <p style={{ margin: '6px 0 14px' }}>
        Podés crear nuevas categorías y elegir su ícono correspondiente de la lista o escribir el que prefieras.
      </p>

      {message && <p className="msg" aria-live="polite">{message}</p>}

      {categories.data?.map(c => (
        <Row key={`${c.id}-${c.name}-${c.emoji}`} category={c} onError={fail} onDone={setMessage} />
      ))}

      <div style={{ marginTop: 20, borderTop: '2px dashed var(--line)', paddingTop: 16 }}>
        <strong>Nueva categoría</strong>

        <div style={{ margin: '8px 0 10px' }}>
          <small style={{ color: 'var(--mut)', display: 'block', marginBottom: 6 }}>Elegí un ícono sugerido:</small>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {EMOJI_OPTIONS.map(em => (
              <button
                key={em}
                type="button"
                className="sm"
                style={{
                  fontSize: '1.3rem',
                  padding: '6px 10px',
                  background: emoji === em ? 'var(--lil)' : undefined,
                  border: emoji === em ? '2px solid var(--ac)' : undefined,
                  transform: emoji === em ? 'scale(1.1)' : undefined,
                }}
                onClick={() => setEmoji(em)}
              >
                {em}
              </button>
            ))}
          </div>
        </div>

        <div className="item">
          <input
            style={{ width: 60, textAlign: 'center', fontSize: '1.2rem' }}
            aria-label="Emoji seleccionado"
            value={emoji}
            onChange={e => setEmoji(e.target.value)}
          />
          <input
            className="grow"
            placeholder="Nombre de la categoría (ej: Mochilas, Accesorios...)"
            aria-label="Nombre"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <button
            type="button"
            className="sm"
            disabled={!name.trim() || add.isPending}
            onClick={() => add.mutate()}
          >
            + Agregar categoría
          </button>
        </div>
      </div>
    </>
  );
}
