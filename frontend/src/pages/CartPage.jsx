import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { orderApi } from '../services/api'
import QuantityControl from '../components/QuantityControl'

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
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-6">Add some products to get started</p>
        <Link to="/" className="btn-primary">Browse Products</Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h1>

      {cartError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
          {cartError}
        </div>
      )}

      <div className="card divide-y divide-gray-100 mb-6">
        {cart.items.map(item => (
          <div key={item.productId} className="flex items-center gap-4 p-4">
            <div className="text-3xl" aria-hidden="true">📦</div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-gray-900 truncate">{item.productName}</p>
              <p className="text-xs text-gray-400">${Number(item.unitPrice).toFixed(2)} each</p>
            </div>
            <QuantityControl
              quantity={item.quantity}
              onDecrement={() => updateItem(item.productId, item.quantity - 1)}
              onIncrement={() => updateItem(item.productId, item.quantity + 1)}
              min={0}
            />
            <p className="font-semibold text-sm w-20 text-right">
              ${Number(item.totalPrice || (item.unitPrice * item.quantity)).toFixed(2)}
            </p>
            <button
              type="button"
              aria-label={`Remove ${item.productName} from cart`}
              className="text-gray-300 hover:text-red-400 transition-colors"
              onClick={() => removeItem(item.productId)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <div className="flex justify-between mb-4 text-sm">
          <span className="text-gray-500">Subtotal ({cart.totalItems} items)</span>
          <span className="font-bold">${Number(cart.totalAmount).toFixed(2)}</span>
        </div>

        <div className="mb-4">
          <label htmlFor="shipping-address" className="block text-sm font-medium text-gray-700 mb-1">
            Shipping address
          </label>
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
          <p className="text-red-500 text-sm mb-3">{orderError}</p>
        )}

        <button
          type="button"
          className="btn-primary w-full"
          disabled={!address.trim() || placing}
          onClick={handlePlaceOrder}
        >
          {placing ? 'Placing order...' : `Place Order · $${Number(cart.totalAmount).toFixed(2)}`}
        </button>
      </div>
    </div>
  )
}
