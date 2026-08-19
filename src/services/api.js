const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`
  const config = {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  }

  if (config.body && typeof config.body !== 'string') {
    config.body = JSON.stringify(config.body)
  }

  const token = localStorage.getItem('tradepilot_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  try {
    const res = await fetch(url, config)
    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({ message: res.statusText }))
      throw new Error(errorBody.message || `Request failed: ${res.status}`)
    }
    return await res.json()
  } catch (err) {
    if (err instanceof TypeError) {
      throw new Error('Unable to reach the server. Check your connection or API configuration.')
    }
    throw err
  }
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  delete: (path) => request(path, { method: 'DELETE' }),
}

export { BASE_URL }
