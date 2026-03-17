import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

const API = import.meta.env.VITE_API_URL || ''

async function apiFetch(path, options = {}) {
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || 'Request failed')
  }

  return res.json()
}

// Products
export const api = {
  getProducts: () => apiFetch('/api/products/'),
  createProduct: (body) => apiFetch('/api/products/', { method: 'POST', body: JSON.stringify(body) }),
  updateProduct: (id, body) => apiFetch(`/api/products/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteProduct: (id) => apiFetch(`/api/products/${id}`, { method: 'DELETE' }),
  scrapeNow: (id) => apiFetch(`/api/products/${id}/scrape-now`, { method: 'POST' }),
  getPriceHistory: (id) => apiFetch(`/api/products/${id}/history`),

  // Notifications
  getNotifications: () => apiFetch('/api/notifications/'),
  markRead: (id) => apiFetch(`/api/notifications/${id}/read`, { method: 'POST' }),
  markAllRead: () => apiFetch('/api/notifications/read-all', { method: 'POST' }),
}
