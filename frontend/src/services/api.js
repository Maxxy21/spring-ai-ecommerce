import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.dispatchEvent(new Event('auth:logout'))
    }
    const message = err.response?.data?.message || err.message || 'An error occurred'
    return Promise.reject(new Error(message))
  }
)

// Auth
export const authApi = {
  register: (data) => api.post('/auth/register', data).then(r => r.data),
  login: (data) => api.post('/auth/login', data).then(r => r.data),
}

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
  uploadImage: (id, file) => {
    const form = new FormData()
    form.append('file', file)
    return api.post(`/products/${id}/image`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data)
  },
}

// Categories
export const categoryApi = {
  list: () => api.get('/categories').then(r => r.data),
  create: (data) => api.post('/categories', data).then(r => r.data),
  update: (id, data) => api.put(`/categories/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/categories/${id}`),
}

// Cart
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

// Admin
export const adminApi = {
  getOrders: (params) => api.get('/admin/orders', { params }).then(r => r.data),
  updateOrderStatus: (id, status) =>
    api.patch(`/admin/orders/${id}/status`, null, { params: { status } }).then(r => r.data),
  getAnalytics: () => api.get('/admin/analytics').then(r => r.data),
  getProducts: (params) => api.get('/products', { params }).then(r => r.data),
  createProduct: (data) => api.post('/products', data).then(r => r.data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data).then(r => r.data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  uploadImage: (id, file) => productApi.uploadImage(id, file),
  getCategories: () => categoryApi.list(),
  createCategory: (data) => categoryApi.create(data),
}

// AI
export const aiApi = {
  chat: (message, sessionId = null) =>
    api.post('/ai/chat', { message, sessionId }).then(r => r.data),
}
