import { useState, type ReactNode } from 'react';

/** Botón de dos pasos: el primer toque pide confirmación y el segundo ejecuta la acción. */
export default function ConfirmButton({ onConfirm, children }: { onConfirm: () => void; children: ReactNode }) {
  const [armed, setArmed] = useState(false);
  return (
    <button
      type="button"
      className="sm danger"
      onBlur={() => setArmed(false)}
      onClick={() => { if (armed) { setArmed(false); onConfirm(); } else setArmed(true); }}
    >
      {armed ? '¿Seguro? Tocá otra vez' : children}
    </button>
  );
}
