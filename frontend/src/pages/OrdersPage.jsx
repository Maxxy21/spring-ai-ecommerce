import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { orderApi } from '../services/api'
import { useAuth } from '../context/AuthContext'

const STATUS_COLORS = {
  PENDING:    'badge-blue',
  CONFIRMED:  'badge-green',
  PROCESSING: 'badge-blue',
  SHIPPED:    'badge-blue',
  DELIVERED:  'badge-green',
  CANCELLED:  'badge-red',
}

export default function OrdersPage() {
  const { userId } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchParams] = useSearchParams()
  const newOrderId = searchParams.get('newOrder')

  useEffect(() => {
    orderApi.myOrders(userId)
      .then(data => setOrders(data.content || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [userId])

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
      {[1, 2].map(i => (
        <div key={i} className="card p-6 animate-pulse space-y-3">
          <div className="h-5 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
        </div>
      ))}
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

      {newOrderId && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-6 text-green-700 text-sm">
          ✓ Order #{newOrderId} placed successfully!
        </div>
      )}

      {error && (
        <div className="text-center py-12 text-red-500">{error}</div>
      )}

      {!error && orders.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📦</p>
          <p>No orders yet. Start shopping!</p>
        </div>
      )}

      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="card p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-gray-900">Order #{order.id}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={STATUS_COLORS[order.status] ?? 'badge-blue'}>{order.status}</span>
                <span className="font-bold">${Number(order.totalAmount).toFixed(2)}</span>
              </div>
            </div>

            {order.items?.length > 0 && (
              <ul className="text-sm text-gray-500 space-y-1 border-t border-gray-100 pt-3">
                {order.items.map(item => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.productName} × {item.quantity}</span>
                    <span>${Number(item.totalPrice).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            )}

            {order.shippingAddress && (
              <p className="text-xs text-gray-400 mt-3">📍 {order.shippingAddress}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
