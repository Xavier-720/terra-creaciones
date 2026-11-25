import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  createColor,
  createProduct,
  updateColor,
  updateProduct,
  deleteProduct,
  toggleProductFeatured,
  uploadProductImage,
  ensureShowcaseExamples,
} from '../../api/client';
import { useCategories, useColors, useProducts, useRefreshCatalog } from '../../api/hooks';
import ProductVisual from '../../components/ProductVisual';
import { colorDistance, extractPalette, suggestColorName, uniqueColorName } from '../../colors';
import { SHAPES, type ColorT, type Product, type Shape } from '../../types';
import ConfirmButton from './ConfirmButton';

// Datos del formulario de un producto antes de guardarlo.
interface Draft {
  id?: number;
  name: string;
  description: string;
  features: string;
  shape: Shape;
  imageUrl: string | null;
  featured: boolean;
  categoryId: number | null;
  colorIds: number[];
}

// Prepara un formulario vacío con la primera categoría ya elegida.
const emptyDraft = (categoryId: number | null): Draft => ({
  name: '',
  description: '',
  features: '',
  shape: 'BAG',
  imageUrl: null,
  featured: false,
  categoryId,
  colorIds: [],
});

// Convierte un producto existente en datos que el formulario puede editar.
const toDraft = (p: Product): Draft => ({
  id: p.id,
  name: p.name,
  description: p.description,
  features: (p.features || []).join('\n'),
  shape: p.shape,
  imageUrl: p.imageUrl,
  featured: p.featured,
  categoryId: p.category?.id ?? null,
  colorIds: (p.colors || []).map(c => c.id),
});

// Gestiona la lista de productos y el formulario para crearlos o editarlos en Supabase.
export default function ProductsAdmin() {
  const products = useProducts();
  const categories = useCategories();
  const colors = useColors();
  const refresh = useRefreshCatalog();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [message, setMessage] = useState('');
  const [detecting, setDetecting] = useState(false);
  // Colores creados durante la detección: se muestran antes de que se recargue el catálogo.
  const [extraColors, setExtraColors] = useState<ColorT[]>([]);
  const [editingColorId, setEditingColorId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editHex, setEditHex] = useState('#ffffff');
  const [newName, setNewName] = useState('');
  const [newHex, setNewHex] = useState('#d9c4a8');
  const [addId, setAddId] = useState<number | ''>('');

  const fail = (e: unknown) => setMessage(e instanceof Error ? e.message : 'Ocurrió un error');
  const closeDraft = () => {
    setDraft(null);
    setMessage('');
    setExtraColors([]);
    setEditingColorId(null);
  };

  // Crea un producto nuevo o guarda los cambios de uno existente en Supabase.
  const save = useMutation({
    mutationFn: async (d: Draft) => {
      const payload = {
        name: d.name,
        description: d.description,
        features: d.features.split('\n'),
        shape: d.shape,
        imageUrl: d.imageUrl,
        featured: d.featured,
        categoryId: d.categoryId!,
        colorIds: d.colorIds,
      };
      if (d.id) {
        await updateProduct(d.id, payload);
      } else {
        await createProduct(payload);
      }
    },
    onSuccess: () => {
      closeDraft();
      setMessage('Producto guardado correctamente en Supabase.');
      refresh();
    },
    onError: fail,
  });

  // Borra un producto del catálogo en Supabase.
  const remove = useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => { setMessage('Producto eliminado.'); refresh(); },
    onError: fail,
  });

  // Muestra un producto en el inicio o lo saca de ahí.
  const toggleFeatured = useMutation({
    mutationFn: (p: Product) => toggleProductFeatured(p.id, p.featured),
    onSuccess: () => refresh(),
    onError: fail,
  });

  // Carga los ejemplos que faltan y completa 12 productos destacados.
  const seedExamples = useMutation({
    mutationFn: ensureShowcaseExamples,
    onSuccess: (added) => {
      setMessage(added ? `Se agregaron ${added} productos de ejemplo y hay 12 en Destacados.` : 'Los 12 ejemplos ya estaban cargados.');
      refresh();
    },
    onError: fail,
  });

  // Corrige el nombre o el tono de un color ya asignado.
  const editColor = useMutation({
    mutationFn: () => updateColor(Number(editingColorId), { name: editName.trim(), hex: editHex }),
    onSuccess: () => {
      const id = Number(editingColorId);
      setExtraColors(prev => prev.map(c => c.id === id ? { ...c, name: editName.trim(), hex: editHex } : c));
      setEditingColorId(null);
      setMessage('Color corregido.');
      refresh();
    },
    onError: fail,
  });

  // Sube la foto y detecta automáticamente su paleta de colores.
  const upload = async (file: File | undefined) => {
    if (!file || !draft) return;
    setMessage('Subiendo foto…');
    try {
      const url = await uploadProductImage(file);
      setDraft(current => current ? { ...current, imageUrl: url } : current);
      setMessage('Foto lista. Detectando colores…');
      setDetecting(true);
      try {
        const hexes = await extractPalette(file);
        const known = [...(colors.data ?? []), ...extraColors];
        const found: ColorT[] = [];
        const created: ColorT[] = [];
        for (const hex of hexes) {
          const near = [...known, ...created].find(c => colorDistance(c.hex, hex) < 75);
          if (near) {
            if (!found.some(c => c.id === near.id)) found.push(near);
          } else {
            const name = uniqueColorName(suggestColorName(hex), [...known, ...created]);
            created.push(await createColor({ name, hex }));
          }
        }
        const palette = [...found, ...created];
        setExtraColors(prev => [...prev.filter(c => !created.some(n => n.id === c.id)), ...created]);
        setDraft(current => current ? { ...current, colorIds: palette.map(c => c.id) } : current);
        const names = palette.map(c => c.name).join(', ');
        setMessage(names
          ? `Paleta detectada: ${names}. Revisala y corregila si hace falta.`
          : 'No encontramos colores en la foto. Agregalos a mano.');
      } catch (e) {
        const detail = e instanceof Error ? e.message : 'error desconocido';
        setMessage(`Foto lista. No se pudo detectar la paleta (${detail}). Agregá los colores a mano.`);
      } finally {
        setDetecting(false);
      }
    } catch (e) {
      fail(e);
    }
  };

  const addColor = (color: ColorT) => {
    if (!draft || draft.colorIds.includes(color.id)) return;
    setDraft({ ...draft, colorIds: [...draft.colorIds, color.id] });
  };

  const createAndAdd = async () => {
    if (!newName.trim()) return;
    try {
      const color = await createColor({ name: newName.trim(), hex: newHex });
      setExtraColors(prev => [...prev, color]);
      addColor(color);
      setNewName('');
      setMessage(`Color “${color.name}” creado y asignado.`);
      refresh();
    } catch (e) {
      fail(e);
    }
  };

  if (draft) {
    const set = (patch: Partial<Draft>) => setDraft({ ...draft, ...patch });
    // Incluye los colores recién detectados aunque React todavía no recargó el catálogo.
    const catalog = [...(colors.data ?? []), ...extraColors.filter(e => !(colors.data ?? []).some(c => c.id === e.id))];
    const chosen = catalog.filter(c => draft.colorIds.includes(c.id));
    const available = catalog.filter(c => !draft.colorIds.includes(c.id));
    const removeColor = (id: number) => set({ colorIds: draft.colorIds.filter(x => x !== id) });
    const openEditor = (c: ColorT) => { setEditingColorId(c.id); setEditName(c.name); setEditHex(c.hex); };

    return (
      <>
        <h2 style={{ margin: '12px 0' }}>{draft.id ? 'Editar producto' : 'Nuevo producto'}</h2>
        <label>Nombre
          <input value={draft.name} onChange={e => set({ name: e.target.value })} />
        </label>
        <label>Categoría
          <select value={draft.categoryId ?? ''} onChange={e => set({ categoryId: Number(e.target.value) })}>
            {categories.data?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
        <label>Descripción corta
          <textarea rows={2} value={draft.description} onChange={e => set({ description: e.target.value })} />
        </label>
        <label>Características (una por línea, por ejemplo “Medidas: 30 x 25 cm”)
          <textarea rows={3} value={draft.features} onChange={e => set({ features: e.target.value })} />
        </label>
        <strong>Colores del producto</strong>
        {draft.imageUrl && <p className="hint">Detectados desde la foto. Podés quitarlos, agregar otros o corregir cualquiera.</p>}
        <div className="chips">
          {chosen.length ? chosen.map(c => (
            <span key={c.id} className={`chip${editingColorId === c.id ? ' editing' : ''}`}>
              <i className="dot" style={{ background: c.hex }} />
              <span>{c.name}</span>
              <button type="button" className="chip-action" title={`Corregir ${c.name}`} aria-label={`Corregir ${c.name}`} onClick={() => openEditor(c)}>✎</button>
              <button type="button" className="chip-action danger" title={`Quitar ${c.name}`} aria-label={`Quitar ${c.name}`} onClick={() => removeColor(c.id)}>×</button>
            </span>
          )) : <span className="hint">Todavía no hay colores asignados.</span>}
        </div>

        {editingColorId !== null && (
          <div className="color-editor">
            <label>Nombre del color<input value={editName} onChange={e => setEditName(e.target.value)} /></label>
            <label>Tono<input type="color" value={editHex} onChange={e => setEditHex(e.target.value)} /></label>
            <p className="hint">El cambio se guarda en el catálogo, así que afecta a todos los productos que usen este color.</p>
            <div className="row">
              <button type="button" className="sm" disabled={!editName.trim() || editColor.isPending} onClick={() => editColor.mutate()}>Guardar color</button>
              <button type="button" className="sm" onClick={() => setEditingColorId(null)}>Cancelar</button>
            </div>
          </div>
        )}

        <div className="add-color">
          <select aria-label="Agregar color de la paleta" value={addId} onChange={e => setAddId(e.target.value ? Number(e.target.value) : '')}>
            <option value="">Elegir color de la paleta…</option>
            {available.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button type="button" className="sm" disabled={addId === ''} onClick={() => {
            const color = catalog.find(c => c.id === addId);
            if (color) addColor(color);
            setAddId('');
          }}>Agregar</button>
        </div>
        <div className="add-color">
          <input type="color" aria-label="Tono del color nuevo" value={newHex} onChange={e => setNewHex(e.target.value)} />
          <input aria-label="Nombre del color nuevo" placeholder="Nombre del color nuevo (ej: Mostaza)" value={newName} onChange={e => setNewName(e.target.value)} />
          <button type="button" className="sm" disabled={!newName.trim()} onClick={() => void createAndAdd()}>Crear y agregar</button>
        </div>
        <label>Ilustración (se usa si no hay foto)
          <select value={draft.shape} onChange={e => set({ shape: e.target.value as Shape })}>
            {Object.entries(SHAPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
        <strong>Foto</strong>
        <div className="row" style={{ margin: '6px 0 14px' }}>
          <span className="mini">
            <ProductVisual name={draft.name || 'Producto'} shape={draft.shape} colors={chosen} imageUrl={draft.imageUrl} />
          </span>
          <input type="file" accept="image/jpeg,image/png,image/webp" style={{ maxWidth: 300 }} disabled={detecting} onChange={e => void upload(e.target.files?.[0])} />
          {draft.imageUrl && (
            <button type="button" className="sm" onClick={() => set({ imageUrl: null })}>
              Quitar foto
            </button>
          )}
        </div>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="checkbox" checked={draft.featured} onChange={e => set({ featured: e.target.checked })} /> Mostrar en el inicio
        </label>
        {message && <p className="msg" aria-live="polite">{message}</p>}
        <div className="row" style={{ marginTop: 18 }}>
          <button
            type="button"
            className="btn"
            disabled={save.isPending || !draft.name.trim() || draft.categoryId === null}
            onClick={() => save.mutate(draft)}
          >
            Guardar producto
          </button>
          <button type="button" className="sm" onClick={closeDraft}>
            Cancelar
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="row" style={{ margin: '6px 0 16px' }}>
        <button
          type="button"
          className="btn"
          onClick={() => {
            closeDraft();
            setDraft(emptyDraft(categories.data?.[0]?.id ?? null));
          }}
        >
          + Nuevo producto
        </button>
        <button type="button" className="sm" disabled={seedExamples.isPending} onClick={() => seedExamples.mutate()}>
          {seedExamples.isPending ? 'Cargando ejemplos…' : 'Completar 12 destacados'}
        </button>
      </div>
      {message && <p className="msg" aria-live="polite">{message}</p>}
      {products.data?.map(p => (
        <div className="item product-item" key={p.id}>
          <span className="mini">
            <ProductVisual name={p.name} shape={p.shape} colors={p.colors} imageUrl={p.imageUrl} />
          </span>
          <div className="grow">
            <strong>{p.name}</strong><br />
            <small>{p.category?.name ?? 'Sin categoría'}{p.featured ? ' · en el inicio' : ''}</small>
          </div>
          <div className="row item-actions">
            <button type="button" className="sm" onClick={() => toggleFeatured.mutate(p)}>
              {p.featured ? 'Sacar del inicio' : 'Mostrar en inicio'}
            </button>
            <button type="button" className="sm" onClick={() => { setMessage(''); setDraft(toDraft(p)); }}>
              Editar
            </button>
            <ConfirmButton onConfirm={() => remove.mutate(p.id)}>Eliminar</ConfirmButton>
          </div>
        </div>
      ))}
      {products.data?.length === 0 && <p>Todavía no hay productos cargados en Supabase.</p>}
    </>
  );
}
