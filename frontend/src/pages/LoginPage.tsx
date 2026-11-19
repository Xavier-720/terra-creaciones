import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../api/supabaseClient';
import { isAdmin } from '../lib';

// Formulario para entrar con una cuenta o crear una nueva.
export default function LoginPage() {
  // Acciones para entrar y para crear una cuenta.
  const { signIn } = useAuth();
  // Permite abrir otra página después de entrar.
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // Envía el formulario y abre la página que le corresponde a cada rol.
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'register') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } },
        });
        if (signUpError) throw signUpError;
        if (!data.session) {
          setError('Revisá tu correo para confirmar la cuenta.');
          return;
        }
        navigate(isAdmin(data.user) ? '/admin' : '/');
        return;
      }
      const data = await signIn(email, password);
      navigate(isAdmin(data.user) ? '/admin' : '/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos completar la operación');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="form-narrow" onSubmit={submit}>
      <h1 style={{ fontSize: '2rem', marginBottom: 8 }}>{mode === 'login' ? 'Ingresar' : 'Crear cuenta'}</h1>
      <div className="row tabs">
        <button type="button" className={`back tab${mode === 'login' ? ' on' : ''}`} style={{ marginTop: 0 }} onClick={() => setMode('login')}>Ya tengo cuenta</button>
        <button type="button" className={`back tab${mode === 'register' ? ' on' : ''}`} style={{ marginTop: 0 }} onClick={() => setMode('register')}>Soy nuevo</button>
      </div>
      {mode === 'register' && <label>Nombre<input value={name} onChange={e => setName(e.target.value)} required autoComplete="name" /></label>}
      <label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" /></label>
      <label>Contraseña<input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={mode === 'register' ? 8 : undefined} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /></label>
      {error && <p className="err" role="alert">{error}</p>}
      <button className="btn" type="submit" disabled={busy}>{busy ? 'Un momento…' : mode === 'login' ? 'Ingresar' : 'Crear cuenta'}</button>
    </form>
  );
}
