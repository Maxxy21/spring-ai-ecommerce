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
      .then(data => { setProducts(data.content || []); setTotalPages(data.totalPages || 0) })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [search, selectedCategory, page])

  const handleSearch = (e) => { setSearch(e.target.value); setPage(0) }

  return (
    <div className="page-container">

      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="relative mb-16 pt-8 pb-14 overflow-hidden">
        {/* Ambient glow layers */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div style={{
            position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
            width: '70%', height: '200%',
            background: 'radial-gradient(ellipse at 50% 30%, rgba(255,77,46,0.10) 0%, rgba(255,140,53,0.04) 40%, transparent 70%)',
          }} />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,77,46,0.25), rgba(255,140,53,0.15), transparent)',
          }} />
        </div>

        {/* Editorial badge */}
        <div className="flex justify-center mb-6 animate-fade-in" style={{ animationDelay: '0ms' }}>
          <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full"
               style={{ background: 'rgba(255,77,46,0.08)', border: '1px solid rgba(255,77,46,0.2)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-coral-500 animate-pulse" />
            <span className="eyebrow" style={{ fontSize: '9px', letterSpacing: '0.22em' }}>
              Powered by Spring AI
            </span>
          </div>
        </div>

        <div className="text-center max-w-4xl mx-auto animate-fade-up" style={{ animationDelay: '60ms' }}>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontWeight: 300,
            fontSize: 'clamp(3.5rem, 8vw, 7rem)',
            lineHeight: 1.0,
            letterSpacing: '-0.02em',
            color: '#f2f2f7',
            marginBottom: '1.25rem',
          }}>
            Discover<br />
            <em style={{
              fontStyle: 'italic',
              background: 'linear-gradient(135deg, #ff4d2e 0%, #ff8c35 60%, #ffad5e 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              intelligently
            </em>
          </h1>

          <p className="text-void-500 text-base max-w-lg mx-auto mb-10 leading-relaxed"
             style={{ animationDelay: '120ms', fontWeight: 300 }}>
            Browse our curated catalog or let the{' '}
            <Link to="/chat" className="text-void-300 hover:text-coral-400 transition-colors underline underline-offset-4 decoration-void-700 hover:decoration-coral-500">
              AI assistant
            </Link>{' '}
            find exactly what you need.
          </p>

          <div className="flex items-center justify-center gap-3 animate-fade-up" style={{ animationDelay: '180ms' }}>
            <Link to="/chat" className="btn-primary gap-2.5 px-7 py-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>
              </svg>
              Ask AI Assistant
            </Link>
            <a href="#products" className="btn-secondary px-7 py-3">
              Browse Catalog
            </a>
          </div>
        </div>

        {/* Stats strip */}
        <div className="flex items-center justify-center gap-8 mt-12 animate-fade-in" style={{ animationDelay: '300ms' }}>
          {[
            { n: 'Spring AI', label: 'Powered' },
            { n: 'Real-time', label: 'Inventory' },
            { n: 'JWT', label: 'Secured' },
          ].map(({ n, label }) => (
            <div key={label} className="text-center">
              <div className="price text-void-300 text-sm font-medium">{n}</div>
              <div className="text-[9px] text-void-700 uppercase tracking-[0.18em] mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Filters ──────────────────────────────────────── */}
      <div id="products" className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-void-600 w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <label htmlFor="product-search" className="sr-only">Search products</label>
          <input
            id="product-search"
            className="input pl-9 text-sm"
            placeholder="Search products…"
            value={search}
            onChange={handleSearch}
          />
        </div>

        {categories.length > 0 && (
          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 flex-wrap sm:flex-nowrap">
            {[{ id: '', name: 'All' }, ...categories].map(c => {
              const active = selectedCategory === String(c.id)
              return (
                <button
                  key={c.id}
                  onClick={() => { setSelectedCategory(String(c.id)); setPage(0) }}
                  className="px-3.5 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-all duration-200"
                  style={{
                    background: active ? 'rgba(255,77,46,0.12)' : 'rgba(255,255,255,0.04)',
                    color: active ? '#ff6b4e' : 'rgba(255,255,255,0.35)',
                    border: `1px solid ${active ? 'rgba(255,77,46,0.3)' : 'rgba(255,255,255,0.07)'}`,
                    letterSpacing: '0.03em',
                  }}
                >
                  {c.name}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Product count ─────────────────────────────────── */}
      {!loading && !error && products.length > 0 && (
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[10px] text-void-700 uppercase tracking-[0.15em]">
            {products.length} products
            {search && ` matching "${search}"`}
          </span>
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.04)' }} />
        </div>
      )}

      {/* ── Skeleton ─────────────────────────────────────── */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="glass overflow-hidden">
              <div className="skeleton" style={{ height: '200px' }} />
              <div className="p-4 space-y-3">
                <div className="skeleton h-2.5 w-1/3 rounded-full" />
                <div className="skeleton h-4 w-3/4 rounded" />
                <div className="skeleton h-2.5 w-full rounded" />
                <div className="skeleton h-2.5 w-2/3 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Error ────────────────────────────────────────── */}
      {error && (
        <div className="text-center py-24">
          <div className="text-5xl mb-5 opacity-30">⚠</div>
          <p className="text-void-400 mb-1">Could not load products</p>
          <p className="text-void-700 text-sm">Check your connection and try again.</p>
        </div>
      )}

      {/* ── Empty ────────────────────────────────────────── */}
      {!loading && !error && products.length === 0 && (
        <div className="text-center py-24">
          <div className="text-6xl mb-5 opacity-20">◎</div>
          <p className="text-void-400 mb-1"
             style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 300 }}>
            No products found
          </p>
          <p className="text-void-700 text-sm mt-2">Try a different keyword or category.</p>
        </div>
      )}

      {/* ── Grid ─────────────────────────────────────────── */}
      {!loading && !error && products.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((p, i) => (
              <div
                key={p.id}
                className="animate-fade-up"
                style={{ animationDelay: `${Math.min(i * 50, 350)}ms` }}
              >
                <ProductCard product={p} />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="flex justify-center items-center gap-4 mt-14" aria-label="Pagination">
              <button
                className="btn-secondary text-xs px-5 py-2"
                disabled={page === 0}
                onClick={() => setPage(p => p - 1)}
              >
                ← Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  const p = totalPages <= 5 ? i : Math.max(0, page - 2) + i
                  if (p >= totalPages) return null
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className="w-8 h-8 rounded-lg text-xs font-medium transition-all duration-200"
                      style={{
                        background: p === page ? 'rgba(255,77,46,0.15)' : 'transparent',
                        color: p === page ? '#ff6b4e' : 'rgba(255,255,255,0.3)',
                        border: `1px solid ${p === page ? 'rgba(255,77,46,0.25)' : 'transparent'}`,
                      }}
                    >
                      {p + 1}
                    </button>
                  )
                })}
              </div>
              <button
                className="btn-secondary text-xs px-5 py-2"
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
