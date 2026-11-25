import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductFeatured,
  uploadProductImage,
} from '../../api/client';
import { useCategories, useColors, useProducts, useRefreshCatalog } from '../../api/hooks';
import ProductVisual from '../../components/ProductVisual';
import { SHAPES, type Product, type Shape } from '../../types';
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

  const fail = (e: unknown) => setMessage(e instanceof Error ? e.message : 'Ocurrió un error');

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
      setDraft(null);
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

  // Sube la foto a Supabase Storage (o genera vista previa segura) y la asigna al borrador.
  const upload = async (file: File | undefined) => {
    if (!file || !draft) return;
    setMessage('Subiendo foto…');
    try {
      const url = await uploadProductImage(file);
      setDraft({ ...draft, imageUrl: url });
      setMessage('Foto lista.');
    } catch (e) {
      fail(e);
    }
  };

  if (draft) {
    const set = (patch: Partial<Draft>) => setDraft({ ...draft, ...patch });
    const chosen = (colors.data ?? []).filter(c => draft.colorIds.includes(c.id));

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
        <div className="chips" style={{ marginBottom: 14 }}>
          {colors.data?.map(c => (
            <label key={c.id} className="chip">
              <input
                type="checkbox"
                checked={draft.colorIds.includes(c.id)}
                onChange={e => set({ colorIds: e.target.checked ? [...draft.colorIds, c.id] : draft.colorIds.filter(id => id !== c.id) })}
              />
              <i className="dot" style={{ background: c.hex }} />{c.name}
            </label>
          ))}
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
          <input type="file" accept="image/jpeg,image/png,image/webp" style={{ maxWidth: 300 }} onChange={e => upload(e.target.files?.[0])} />
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
          <button type="button" className="sm" onClick={() => { setDraft(null); setMessage(''); }}>
            Cancelar
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div style={{ margin: '6px 0 16px' }}>
        <button
          type="button"
          className="btn"
          onClick={() => {
            setMessage('');
            setDraft(emptyDraft(categories.data?.[0]?.id ?? null));
          }}
        >
          + Nuevo producto
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
