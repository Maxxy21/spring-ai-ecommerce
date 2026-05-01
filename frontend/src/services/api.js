import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || err.message || 'An error occurred'
    return Promise.reject(new Error(message))
  }
)

// Products
export const productApi = {
  list: (page = 0, size = 20) =>
    api.get('/products', { params: { page, size, sort: 'createdAt,desc' } }).then(r => r.data),
  getById: (id) => api.get(`/products/${id}`).then(r => r.data),
  search: (params) => api.get('/products/search', { params }).then(r => r.data),
  latest: () => api.get('/products/latest').then(r => r.data),
  create: (data) => api.post('/products', data).then(r => r.data),
  update: (id, data) => api.put(`/products/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/products/${id}`),
}

// Categories
export const categoryApi = {
  list: () => api.get('/categories').then(r => r.data),
}

// Cart — userId comes from the authenticated principal on the backend.
// The path userId must match the authenticated user; the backend enforces ownership.
export const cartApi = {
  get: (userId) => api.get(`/cart/${userId}`).then(r => r.data),
  addItem: (userId, productId, quantity = 1) =>
    api.post(`/cart/${userId}/items`, { productId, quantity }).then(r => r.data),
  updateItem: (userId, productId, quantity) =>
    api.put(`/cart/${userId}/items/${productId}`, null, { params: { quantity } }).then(r => r.data),
  removeItem: (userId, productId) =>
    api.delete(`/cart/${userId}/items/${productId}`).then(r => r.data),
  clear: (userId) => api.delete(`/cart/${userId}`),
}

// Orders
export const orderApi = {
  place: (shippingAddress, notes = '') =>
    api.post('/orders', { shippingAddress, notes }).then(r => r.data),
  getById: (id) => api.get(`/orders/${id}`).then(r => r.data),
  myOrders: (userId, page = 0) =>
    api.get(`/orders/user/${userId}`, { params: { page, size: 10 } }).then(r => r.data),
}

// AI
export const aiApi = {
  chat: (message, sessionId = null) =>
    api.post('/ai/chat', { message, sessionId }).then(r => r.data),
}
