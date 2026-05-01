import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { productApi, categoryApi } from '../services/api'
import ProductCard from '../components/ProductCard'

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    categoryApi.list().then(setCategories).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    setError(null)

    const params = { page, size: 12 }
    if (search) params.keyword = search
    if (selectedCategory) params.categoryId = selectedCategory

    productApi.search(params)
      .then(data => {
        setProducts(data.content || [])
        setTotalPages(data.totalPages || 0)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [search, selectedCategory, page])

  const handleSearch = (e) => {
    setSearch(e.target.value)
    setPage(0)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI-Powered Shop</h1>
        <p className="text-gray-500">
          Browse products or ask the{' '}
          <Link to="/chat" className="text-brand-600 hover:underline">AI assistant</Link>
          {' '}to find what you need
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <label htmlFor="product-search" className="sr-only">Search products</label>
        <input
          id="product-search"
          className="input flex-1"
          placeholder="Search products..."
          value={search}
          onChange={handleSearch}
        />
        <label htmlFor="category-filter" className="sr-only">Filter by category</label>
        <select
          id="category-filter"
          className="input sm:w-48"
          value={selectedCategory}
          onChange={(e) => { setSelectedCategory(e.target.value); setPage(0) }}
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Content */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="bg-gray-200 h-40" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-16">
          <p className="text-red-500 mb-2">⚠️ Could not load products</p>
          <p className="text-sm text-gray-400">Please check your connection and try again.</p>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🔍</p>
          <p>No products found. Try a different search.</p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>

          {totalPages > 1 && (
            <nav className="flex justify-center gap-2 mt-8" aria-label="Pagination">
              <button
                className="btn-secondary"
                disabled={page === 0}
                onClick={() => setPage(p => p - 1)}
              >
                ← Prev
              </button>
              <span className="px-4 py-2 text-sm text-gray-600">
                Page {page + 1} of {totalPages}
              </span>
              <button
                className="btn-secondary"
                disabled={page >= totalPages - 1}
                onClick={() => setPage(p => p + 1)}
              >
                Next →
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  )
}
