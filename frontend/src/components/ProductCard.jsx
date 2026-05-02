import { memo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { categoryEmoji } from '../utils/categoryEmoji'

const ADDED_RESET_MS = 1800

function ProductCard({ product }) {
  const { addItem, loading } = useCart()
  const { isAuthenticated } = useAuth()
  const [added, setAdded] = useState(false)
  const [hovered, setHovered] = useState(false)

  const handleAddToCart = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) return
    await addItem(product.id, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), ADDED_RESET_MS)
  }

  return (
    <div
      className="card-shine flex flex-col overflow-hidden animate-fade-up"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        border: `1px solid ${hovered ? 'rgba(255,77,46,0.2)' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: '1.125rem',
        boxShadow: hovered
          ? '0 12px 48px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(255,77,46,0.1) inset, 0 0 32px rgba(255,77,46,0.07)'
          : '0 4px 24px rgba(0,0,0,0.4)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Image area */}
      <Link to={`/products/${product.id}`} className="block relative overflow-hidden" style={{ borderRadius: '1.125rem 1.125rem 0 0' }}>
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full object-cover"
            style={{
              height: '200px',
              transform: hovered ? 'scale(1.06)' : 'scale(1)',
              transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        ) : (
          <div
            className="flex items-center justify-center relative"
            style={{
              height: '200px',
              background: hovered
                ? 'linear-gradient(135deg, rgba(255,77,46,0.09), rgba(255,140,53,0.07))'
                : 'linear-gradient(135deg, rgba(255,77,46,0.05), rgba(255,140,53,0.04))',
              transition: 'background 0.4s ease',
            }}
            role="img"
            aria-label={product.categoryName ?? 'Product'}
          >
            <span
              className="select-none"
              style={{
                fontSize: '3.5rem',
                transform: hovered ? 'scale(1.1)' : 'scale(1)',
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'block',
              }}
            >
              {categoryEmoji(product.categoryName)}
            </span>
            {/* Bottom gradient fade */}
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(to top, rgba(8,8,14,0.5) 0%, transparent 60%)',
            }} />
          </div>
        )}

        {/* Overlay gradient on hover */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(8,8,14,0.4) 0%, transparent 60%)',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />

        {/* Stock badge */}
        <div className="absolute top-2.5 right-2.5">
          {product.inStock
            ? <span className="badge-green" style={{ fontSize: '9px', padding: '2px 7px' }}>In stock</span>
            : <span className="badge-red" style={{ fontSize: '9px', padding: '2px 7px' }}>Sold out</span>
          }
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {product.categoryName && (
          <span className="eyebrow mb-1.5" style={{ fontSize: '9px', letterSpacing: '0.18em' }}>
            {product.categoryName}
          </span>
        )}

        <Link
          to={`/products/${product.id}`}
          className="font-medium text-sm leading-snug mb-2 line-clamp-2 transition-colors duration-200"
          style={{
            color: hovered ? '#f2f2f7' : '#c8c8db',
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          {product.name}
        </Link>

        {product.description && (
          <p className="text-[11px] line-clamp-2 mb-3 flex-1 leading-relaxed" style={{ color: 'rgba(255,255,255,0.22)' }}>
            {product.description}
          </p>
        )}

        <div
          className="flex items-center justify-between mt-auto pt-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <span className="price text-base font-medium" style={{ color: '#f2f2f7' }}>
            ${Number(product.price).toFixed(2)}
          </span>

          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!product.inStock || loading}
              aria-label={`Add ${product.name} to cart`}
              className="text-xs rounded-lg font-medium transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                padding: '5px 12px',
                background: added
                  ? 'rgba(16,185,129,0.15)'
                  : 'rgba(255,77,46,0.15)',
                color: added ? '#34d399' : '#ff8c7e',
                border: `1px solid ${added ? 'rgba(16,185,129,0.25)' : 'rgba(255,77,46,0.25)'}`,
                letterSpacing: '0.02em',
              }}
            >
              {added ? '✓ Added' : '+ Cart'}
            </button>
          ) : (
            <Link
              to="/auth"
              className="text-xs rounded-lg font-medium transition-all duration-200"
              style={{
                padding: '5px 12px',
                background: 'rgba(255,255,255,0.05)',
                color: 'rgba(255,255,255,0.4)',
                border: '1px solid rgba(255,255,255,0.08)',
                letterSpacing: '0.02em',
              }}
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default memo(ProductCard)
