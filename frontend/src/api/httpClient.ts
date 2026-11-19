export const API_URL: string = import.meta.env.VITE_API_URL ?? '';

const TOKEN_KEY = 'terra_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t: string | null) => (t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY));

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (init.body && !(init.body instanceof FormData)) headers.set('Content-Type', 'application/json');
  const res = await fetch(API_URL + path, { ...init, headers });
  if (!res.ok) {
    let message = 'Ocurrió un error. Probá de nuevo.';
    try {
      const body = await res.json();
      message = body.detail ?? body.message ?? message;
    } catch {}
    throw new ApiError(res.status, message);
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body ?? {}) }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT', body: JSON.stringify(body ?? {}) }),
  del: (path: string) => request<void>(path, { method: 'DELETE' }),
  upload: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return request<{ url: string }>('/api/admin/uploads', { method: 'POST', body: form });
  },
};

export const imageSrc = (url: string | null) => (url ? (url.startsWith('http') ? url : API_URL + url) : null);
