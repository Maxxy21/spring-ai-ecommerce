import { useEffect, useState, useRef } from 'react'
import { adminApi, categoryApi } from '../services/api'

const ORDER_STATUSES = ['PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED']

const STATUS_BADGE = {
  PENDING:    'badge-amber',
  CONFIRMED:  'badge-blue',
  PROCESSING: 'badge-blue',
  SHIPPED:    'badge-coral',
  DELIVERED:  'badge-green',
  CANCELLED:  'badge-red',
}

// ─── Analytics cards ────────────────────────────────────────────────────────
function StatCard({ label, value, sub }) {
  return (
    <div className="glass p-5">
      <p className="text-xs text-void-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-bold text-void-50 price">{value ?? '—'}</p>
      {sub && <p className="text-xs text-void-600 mt-0.5">{sub}</p>}
    </div>
  )
}

// ─── Products tab ────────────────────────────────────────────────────────────
function ProductsTab() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name:'', description:'', price:'', stockQuantity:'', categoryId:'' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [imageUploading, setImageUploading] = useState(null)
  const fileRef = useRef()

  const load = () => {
    setLoading(true)
    adminApi.getProducts({ page, size: 10, sort: 'createdAt,desc' })
      .then(data => { setProducts(data.content || []); setTotalPages(data.totalPages || 0) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { categoryApi.list().then(setCategories) }, [])
  useEffect(() => { load() }, [page]) // eslint-disable-line

  const openCreate = () => {
    setEditing(null)
    setForm({ name:'', description:'', price:'', stockQuantity:'', categoryId:'' })
    setError('')
    setShowForm(true)
  }

  const openEdit = (p) => {
    setEditing(p)
    setForm({ name: p.name, description: p.description||'', price: p.price, stockQuantity: p.stockQuantity, categoryId: p.categoryId||'', imageUrl: p.imageUrl||'' })
    setError('')
    setShowForm(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stockQuantity: Number(form.stockQuantity),
        categoryId: form.categoryId || null,
        imageUrl: form.imageUrl || null,
      }
      if (editing) {
        await adminApi.updateProduct(editing.id, payload)
      } else {
        await adminApi.createProduct(payload)
      }
      setShowForm(false)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    await adminApi.deleteProduct(id)
    load()
  }

  const handleImageUpload = async (productId, file) => {
    setImageUploading(productId)
    try {
      await adminApi.uploadImage(productId, file)
      load()
    } catch (err) {
      alert(err.message)
    } finally {
      setImageUploading(null)
    }
  }

  const set = (f) => (e) => setForm(prev => ({ ...prev, [f]: e.target.value }))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-void-100" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Products</h2>
        <button onClick={openCreate} className="btn-primary text-xs">+ Add Product</button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass w-full max-w-lg p-7 animate-fade-up">
            <h3 className="font-semibold text-void-100 mb-5" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              {editing ? 'Edit Product' : 'New Product'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="label">Name</label>
                <input className="input" value={form.name} onChange={set('name')} required />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea className="input resize-none" rows={2} value={form.description} onChange={set('description')} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Price ($)</label>
                  <input type="number" step="0.01" min="0.01" className="input" value={form.price} onChange={set('price')} required />
                </div>
                <div>
                  <label className="label">Stock</label>
                  <input type="number" min="0" className="input" value={form.stockQuantity} onChange={set('stockQuantity')} required />
                </div>
              </div>
              <div>
                <label className="label">Category</label>
                <select className="input" value={form.categoryId} onChange={set('categoryId')}>
                  <option value="">None</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1" disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="glass overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1,2,3].map(i => <div key={i} className="skeleton h-10 rounded" />)}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.05] text-void-500 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3">Product</th>
                <th className="text-left px-5 py-3 hidden md:table-cell">Category</th>
                <th className="text-right px-5 py-3">Price</th>
                <th className="text-right px-5 py-3">Stock</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center text-base flex-shrink-0">📦</div>
                      )}
                      <span className="text-void-200 font-medium truncate max-w-[180px]">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-void-500 hidden md:table-cell">{p.categoryName || '—'}</td>
                  <td className="px-5 py-3 text-right price text-void-200">${Number(p.price).toFixed(2)}</td>
                  <td className="px-5 py-3 text-right">
                    <span className={p.stockQuantity > 0 ? 'badge-green text-[10px]' : 'badge-red text-[10px]'}>
                      {p.stockQuantity}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="text-xs text-void-500 hover:text-void-200 transition-colors"
                        onClick={() => { fileRef.current.dataset.pid = p.id; fileRef.current.click() }}
                        disabled={imageUploading === p.id}
                      >
                        {imageUploading === p.id ? '...' : '📷'}
                      </button>
                      <button
                        className="text-xs text-void-500 hover:text-coral-400 transition-colors"
                        onClick={() => openEdit(p)}
                      >Edit</button>
                      <button
                        className="text-xs text-void-600 hover:text-red-400 transition-colors"
                        onClick={() => handleDelete(p.id)}
                      >Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          const pid = e.target.dataset.pid
          if (file && pid) handleImageUpload(Number(pid), file)
          e.target.value = ''
        }}
      />

      {totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-5">
          <button className="btn-secondary text-xs" disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span className="text-xs text-void-500 self-center">{page + 1} / {totalPages}</span>
          <button className="btn-secondary text-xs" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}
    </div>
  )
}

// ─── Orders tab ──────────────────────────────────────────────────────────────
function OrdersTab() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [statusFilter, setStatusFilter] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  const load = () => {
    setLoading(true)
    const params = { page, size: 15, sort: 'createdAt,desc' }
    if (statusFilter) params.status = statusFilter
    adminApi.getOrders(params)
      .then(data => { setOrders(data.content || []); setTotalPages(data.totalPages || 0) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [page, statusFilter]) // eslint-disable-line

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId)
    try {
      const updated = await adminApi.updateOrderStatus(orderId, newStatus)
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o))
    } catch (err) {
      alert(err.message)
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-void-100" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Orders</h2>
        <select
          className="input w-40 text-xs"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(0) }}
        >
          <option value="">All statuses</option>
          {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="glass overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-10 rounded" />)}</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 text-void-500 text-sm">No orders found</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.05] text-void-500 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3">Order</th>
                <th className="text-left px-5 py-3 hidden sm:table-cell">Date</th>
                <th className="text-right px-5 py-3">Total</th>
                <th className="text-left px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3">
                    <p className="text-void-200 font-medium">#{order.id}</p>
                    <p className="text-xs text-void-600 truncate max-w-[140px]">{order.userId}</p>
                  </td>
                  <td className="px-5 py-3 text-void-500 text-xs hidden sm:table-cell">
                    {new Date(order.createdAt).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}
                  </td>
                  <td className="px-5 py-3 text-right price text-void-200">${Number(order.totalAmount).toFixed(2)}</td>
                  <td className="px-5 py-3">
                    <select
                      className="bg-transparent border border-white/[0.08] rounded-lg text-xs px-2 py-1 text-void-300
                                 hover:border-white/[0.15] transition-colors cursor-pointer"
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      {ORDER_STATUSES.map(s => (
                        <option key={s} value={s} className="bg-void-800">{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-5">
          <button className="btn-secondary text-xs" disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span className="text-xs text-void-500 self-center">{page + 1} / {totalPages}</span>
          <button className="btn-secondary text-xs" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}
    </div>
  )
}

// ─── Categories tab ──────────────────────────────────────────────────────────
function CategoriesTab() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', description: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    categoryApi.list().then(setCategories).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await adminApi.createCategory(form)
      setForm({ name: '', description: '' })
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-xl">
      <h2 className="text-xl font-semibold text-void-100 mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Categories</h2>

      <form onSubmit={handleCreate} className="glass p-5 mb-6 space-y-4">
        <h3 className="text-sm font-medium text-void-300">Add Category</h3>
        <div>
          <label className="label">Name</label>
          <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
        </div>
        <div>
          <label className="label">Description</label>
          <input className="input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button type="submit" className="btn-primary text-xs" disabled={saving}>{saving ? 'Saving...' : 'Add Category'}</button>
      </form>

      <div className="glass divide-y divide-white/[0.05]">
        {loading ? (
          <div className="p-4 space-y-2">{[1,2,3].map(i => <div key={i} className="skeleton h-8 rounded" />)}</div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8 text-void-500 text-sm">No categories yet</div>
        ) : categories.map(c => (
          <div key={c.id} className="flex items-center justify-between px-5 py-3">
            <div>
              <p className="text-void-200 text-sm font-medium">{c.name}</p>
              {c.description && <p className="text-xs text-void-600 mt-0.5">{c.description}</p>}
            </div>
            {c.productCount != null && (
              <span className="text-xs text-void-600 price">{c.productCount} products</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main AdminPage ───────────────────────────────────────────────────────────
const TABS = ['Overview', 'Products', 'Orders', 'Categories']

export default function AdminPage() {
  const [tab, setTab] = useState('Overview')
  const [analytics, setAnalytics] = useState(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)

  useEffect(() => {
    adminApi.getAnalytics()
      .then(setAnalytics)
      .finally(() => setAnalyticsLoading(false))
  }, [])

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs text-coral-400 font-medium uppercase tracking-widest mb-2">Admin</p>
        <h1 className="section-title">Dashboard</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 border-b border-white/[0.06] pb-0">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 -mb-px ${
              tab === t
                ? 'border-coral-500 text-coral-400'
                : 'border-transparent text-void-500 hover:text-void-300'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'Overview' && (
        <div className="space-y-8 animate-fade-up">
          {analyticsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[1,2,3,4].map(i => <div key={i} className="glass p-5 skeleton h-20" />)}
            </div>
          ) : analytics ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard label="Total Revenue" value={`$${Number(analytics.totalRevenue || 0).toFixed(2)}`} />
                <StatCard label="Total Orders"  value={analytics.totalOrders} />
                <StatCard label="Products"      value={analytics.totalProducts} />
                <StatCard label="Users"         value={analytics.totalUsers} />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <StatCard label="Pending"   value={analytics.pendingOrders}   sub="Awaiting action" />
                <StatCard label="Delivered" value={analytics.deliveredOrders} sub="Completed" />
                <StatCard label="Cancelled" value={analytics.cancelledOrders} sub="Refundable" />
              </div>

              {analytics.recentOrders?.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-void-400 uppercase tracking-wider mb-4">Recent Orders</h3>
                  <div className="glass divide-y divide-white/[0.05]">
                    {analytics.recentOrders.map(order => (
                      <div key={order.id} className="flex items-center justify-between px-5 py-3">
                        <div>
                          <p className="text-void-200 text-sm font-medium">#{order.id}</p>
                          <p className="text-xs text-void-600">
                            {new Date(order.createdAt).toLocaleDateString('en-GB', { day:'numeric', month:'short' })}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`${STATUS_BADGE[order.status] ?? 'badge-blue'} text-[10px]`}>{order.status}</span>
                          <span className="price text-sm text-void-200">${Number(order.totalAmount).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-void-500 text-sm">Could not load analytics.</p>
          )}
        </div>
      )}

      {tab === 'Products'   && <div className="animate-fade-up"><ProductsTab /></div>}
      {tab === 'Orders'     && <div className="animate-fade-up"><OrdersTab /></div>}
      {tab === 'Categories' && <div className="animate-fade-up"><CategoriesTab /></div>}
    </div>
  )
}
