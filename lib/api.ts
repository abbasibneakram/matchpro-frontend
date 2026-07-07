const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function request(path: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || 'Request failed');
  }
  return res.json();
}

export const api = {
  get: (path: string) => request(path),
  post: (path: string, data: unknown) =>
    request(path, { method: 'POST', body: JSON.stringify(data) }),
  patch: (path: string, data: unknown) =>
    request(path, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (path: string) => request(path, { method: 'DELETE' }),
  // No Content-Type here — the browser sets the multipart boundary itself.
  // Reuses the same base fetch machinery (auth header, base URL, error handling).
  upload: (path: string, file: File) => {
    const form = new FormData();
    form.append('file', file);
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    }).then(async (res) => {
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Upload failed');
      }
      return res.json();
    });
  },
};
