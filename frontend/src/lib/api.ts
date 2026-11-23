const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('careercompass_token') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorJson;
      try { errorJson = JSON.parse(errorText); } catch { errorJson = { detail: errorText }; }
      throw new Error(errorJson.detail || `Request failed with status ${res.status}`);
    }

    return await res.json() as T;
  } catch (err: any) {
    console.error(`API Error on [${endpoint}]:`, err.message);
    throw err;
  }
}
