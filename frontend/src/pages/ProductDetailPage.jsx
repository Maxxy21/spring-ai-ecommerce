import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { productApi } from '../services/api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { categoryEmoji } from '../utils/categoryEmoji'
import QuantityControl from '../components/QuantityControl'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    productApi.getById(id)
      .then(setProduct)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = async () => {
    if (!isAuthenticated) { navigate('/auth'); return }
    setAdding(true)
    try {
      await addItem(product.id, quantity)
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } finally {
      setAdding(false)
    }
  }

  if (loading) return (
    <div className="page-container max-w-4xl">
      <div className="skeleton h-4 w-20 rounded-full mb-8" />
      <div className="glass p-8 sm:p-12">
        <div className="flex flex-col sm:flex-row gap-10">
          <div className="skeleton sm:w-72 flex-shrink-0 rounded-2xl" style={{ height: '288px' }} />
          <div className="flex-1 space-y-4 pt-2">
            <div className="skeleton h-3 w-1/5 rounded-full" />
            <div className="skeleton h-12 w-4/5 rounded" />
            <div className="skeleton h-3 w-full rounded" />
            <div className="skeleton h-3 w-3/4 rounded" />
            <div className="skeleton h-3 w-2/3 rounded" />
            <div className="skeleton h-10 w-1/3 rounded-xl mt-4" />
          </div>
        </div>
      </div>
    </div>
  )

  if (error) return (
    <div className="page-container max-w-4xl text-center py-20">
      <p className="text-red-400 mb-6" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 300 }}>{error}</p>
      <Link to="/" className="btn-primary">← Back to products</Link>
    </div>
  )

  return (
    <div className="page-container max-w-4xl animate-fade-up">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8 text-xs text-void-700">
        <Link to="/" className="hover:text-void-400 transition-colors">Products</Link>
        <span>/</span>
        {product.categoryName && (
          <>
            <span className="text-void-600">{product.categoryName}</span>
            <span>/</span>
          </>
        )}
        <span className="text-void-500 truncate max-w-[180px]">{product.name}</span>
      </div>

      <div
        className="overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '1.5rem',
          boxShadow: '0 8px 48px rgba(0,0,0,0.5)',
        }}
      >
        <div className="flex flex-col sm:flex-row">

          {/* Image — left panel */}
          <div
            className="sm:w-80 flex-shrink-0 flex items-center justify-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,77,46,0.05), rgba(255,140,53,0.03))',
              borderRight: '1px solid rgba(255,255,255,0.05)',
              minHeight: '320px',
            }}
          >
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
                style={{ minHeight: '320px' }}
              />
            ) : (
              <div
                className="flex flex-col items-center justify-center gap-4 w-full h-full p-8"
                style={{ minHeight: '320px' }}
                role="img"
                aria-label={product.categoryName ?? 'Product'}
              >
                <span className="text-8xl select-none" style={{ filter: 'drop-shadow(0 8px 24px rgba(255,77,46,0.2))' }}>
                  {categoryEmoji(product.categoryName)}
                </span>
              </div>
            )}
            {/* Subtle overlay */}
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(to right, transparent 80%, rgba(8,8,14,0.3))',
              pointerEvents: 'none',
            }} />
          </div>

          {/* Info — right panel */}
          <div className="flex-1 p-8 sm:p-10 min-w-0">

            {product.categoryName && (
              <span className="eyebrow block mb-3" style={{ fontSize: '9px', letterSpacing: '0.22em' }}>
                {product.categoryName}
              </span>
            )}

            <h1
              className="mb-5 leading-tight"
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontWeight: 300,
                fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                color: '#f2f2f7',
                letterSpacing: '-0.01em',
              }}
            >
              {product.name}
            </h1>

            {product.description && (
              <p className="mb-8 leading-relaxed text-sm" style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 300 }}>
                {product.description}
              </p>
            )}

            {/* Price + stock row */}
            <div className="flex items-baseline gap-4 mb-8">
              <span className="price font-light" style={{ fontSize: '2.25rem', color: '#f2f2f7' }}>
                ${Number(product.price).toFixed(2)}
              </span>
              {product.inStock
                ? (
                  <div className="flex items-center gap-2">
                    <span className="badge-green">{product.stockQuantity} in stock</span>
                  </div>
                )
                : <span className="badge-red">Out of stock</span>
              }
            </div>

            {/* Divider */}
            <div className="divider mb-8" />

            {product.inStock ? (
              <div className="flex items-center gap-4">
                <QuantityControl
                  quantity={quantity}
                  onDecrement={() => setQuantity(q => Math.max(1, q - 1))}
                  onIncrement={() => setQuantity(q => Math.min(product.stockQuantity, q + 1))}
                  min={1}
                  max={product.stockQuantity}
                />
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={adding}
                  className="flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-300"
                  style={added ? {
                    background: 'rgba(16,185,129,0.15)',
                    color: '#34d399',
                    border: '1px solid rgba(16,185,129,0.25)',
                  } : {
                    background: 'linear-gradient(135deg, #ff4d2e, #ff8c35)',
                    color: 'white',
                    boxShadow: '0 0 24px rgba(255,77,46,0.25)',
                    border: '1px solid rgba(255,77,46,0.3)',
                  }}
                >
                  {added ? '✓ Added to cart!' : adding ? 'Adding…' : isAuthenticated ? 'Add to Cart' : 'Sign in to buy'}
                </button>
              </div>
            ) : (
              <p className="text-void-700 text-sm italic">This product is currently unavailable.</p>
            )}

            {/* Trust badges */}
            <div className="flex items-center gap-5 mt-8">
              {[
                { icon: '⚡', text: 'Fast dispatch' },
                { icon: '🔒', text: 'Secure checkout' },
                { icon: '↩', text: 'Easy returns' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-1.5">
                  <span className="text-xs">{icon}</span>
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
