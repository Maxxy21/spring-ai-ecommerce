import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
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
    api.get(`/products?page=${page}&size=${size}&sort=createdAt,desc`).then(r => r.data),
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

// Cart
const USER_ID = 'demo-user'  // In a real app this comes from auth
export const cartApi = {
  get: () => api.get(`/cart/${USER_ID}`).then(r => r.data),
  addItem: (productId, quantity = 1) =>
    api.post(`/cart/${USER_ID}/items`, { productId, quantity }).then(r => r.data),
  updateItem: (productId, quantity) =>
    api.put(`/cart/${USER_ID}/items/${productId}?quantity=${quantity}`).then(r => r.data),
  removeItem: (productId) =>
    api.delete(`/cart/${USER_ID}/items/${productId}`).then(r => r.data),
  clear: () => api.delete(`/cart/${USER_ID}`),
}

// Orders
export const orderApi = {
  place: (shippingAddress, notes = '') =>
    api.post('/orders', { userId: USER_ID, shippingAddress, notes }).then(r => r.data),
  getById: (id) => api.get(`/orders/${id}`).then(r => r.data),
  myOrders: (page = 0) =>
    api.get(`/orders/user/${USER_ID}?page=${page}&size=10`).then(r => r.data),
}

// AI
export const aiApi = {
  chat: (message, sessionId = null) =>
    api.post('/ai/chat', { message, sessionId }).then(r => r.data),
}
