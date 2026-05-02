import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { orderApi } from '../services/api'
import QuantityControl from '../components/QuantityControl'
import { categoryEmoji } from '../utils/categoryEmoji'

export default function CartPage() {
  const { cart, error: cartError, removeItem, updateItem, clearCart } = useCart()
  const [address, setAddress] = useState('')
  const [placing, setPlacing] = useState(false)
  const [orderError, setOrderError] = useState(null)
  const navigate = useNavigate()

  const handlePlaceOrder = async () => {
    if (!address.trim()) return
    setPlacing(true)
    setOrderError(null)
    try {
      const order = await orderApi.place(address)
      await clearCart()
      navigate(`/orders?newOrder=${order.id}`)
    } catch (err) {
      setOrderError(err.message)
    } finally {
      setPlacing(false)
    }
  }

  if (cart.items.length === 0) {
    return (
      <div className="page-container max-w-2xl text-center py-28">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8"
          style={{ background: 'rgba(255,77,46,0.06)', border: '1px solid rgba(255,77,46,0.1)' }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(255,77,46,0.4)" strokeWidth="1.2">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
        </div>
        <h2
          className="mb-3"
          style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: '2rem', color: '#c8c8db' }}
        >
          Your cart is empty
        </h2>
        <p className="text-void-700 mb-10 text-sm">Add some products to get started.</p>
        <Link to="/" className="btn-primary px-8 py-3">Browse Products</Link>
      </div>
    )
  }

  return (
    <div className="page-container max-w-3xl">

      {/* Header */}
      <div className="flex items-baseline gap-4 mb-8">
        <h1 className="section-title">Cart</h1>
        <span className="price text-void-700 text-sm">{cart.totalItems} item{cart.totalItems !== 1 ? 's' : ''}</span>
      </div>

      {cartError && (
        <div className="text-sm text-red-400 mb-5 px-4 py-3 rounded-xl"
             style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
          {cartError}
        </div>
      )}

      {/* Items */}
      <div
        className="mb-5 overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '1.25rem',
          boxShadow: '0 4px 32px rgba(0,0,0,0.45)',
        }}
      >
        {cart.items.map((item, idx) => (
          <div
            key={item.productId}
            className="flex items-center gap-4 px-5 py-4 animate-fade-up"
            style={{
              borderBottom: idx < cart.items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              animationDelay: `${idx * 50}ms`,
            }}
          >
            {/* Thumbnail */}
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-xl select-none"
              style={{ background: 'rgba(255,77,46,0.06)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              {categoryEmoji(item.categoryName)}
            </div>

            {/* Name + price per unit */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-void-200 truncate">{item.productName}</p>
              <p className="price text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>
                ${Number(item.unitPrice).toFixed(2)} each
              </p>
            </div>

            {/* Quantity control */}
            <QuantityControl
              quantity={item.quantity}
              onDecrement={() => updateItem(item.productId, item.quantity - 1)}
              onIncrement={() => updateItem(item.productId, item.quantity + 1)}
              min={0}
            />

            {/* Line total */}
            <p className="price font-medium text-sm text-void-200 w-16 text-right flex-shrink-0">
              ${Number(item.totalPrice || (item.unitPrice * item.quantity)).toFixed(2)}
            </p>

            {/* Remove */}
            <button
              type="button"
              aria-label={`Remove ${item.productName}`}
              onClick={() => removeItem(item.productId)}
              className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200"
              style={{
                color: 'rgba(255,255,255,0.2)',
                background: 'transparent',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.2)'; e.currentTarget.style.background = 'transparent' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Summary + checkout */}
      <div
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '1.25rem',
          padding: '1.75rem',
          boxShadow: '0 4px 32px rgba(0,0,0,0.45)',
        }}
      >
        {/* Totals */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-sm">
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>Subtotal</span>
            <span className="price text-void-300">${Number(cart.totalAmount).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>Shipping</span>
            <span className="text-emerald-400 text-xs font-medium">Free</span>
          </div>
          <div
            className="flex justify-between pt-3 mt-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <span className="text-sm text-void-200 font-medium">Total</span>
            <span className="price font-medium text-void-50 text-lg">${Number(cart.totalAmount).toFixed(2)}</span>
          </div>
        </div>

        {/* Shipping address */}
        <div className="mb-5">
          <label htmlFor="shipping-address" className="label">Shipping address</label>
          <textarea
            id="shipping-address"
            className="input resize-none"
            rows={2}
            placeholder="123 Main St, City, Country"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        {orderError && (
          <p className="text-red-400 text-sm mb-4">{orderError}</p>
        )}

        <button
          type="button"
          className="btn-primary w-full py-3.5 text-sm"
          disabled={!address.trim() || placing}
          onClick={handlePlaceOrder}
        >
          {placing
            ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity="0.3"/>
                  <path d="M21 12a9 9 0 00-9-9" />
                </svg>
                Placing order…
              </span>
            )
            : `Place Order · $${Number(cart.totalAmount).toFixed(2)}`
          }
        </button>

        <p className="text-center text-[10px] mt-3" style={{ color: 'rgba(255,255,255,0.18)', letterSpacing: '0.05em' }}>
          Secured by JWT · No payment required in demo
        </p>
      </div>
    </div>
  )
}
