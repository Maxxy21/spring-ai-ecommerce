import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { orderApi } from '../services/api'
import { useAuth } from '../context/AuthContext'

const STATUS_CONFIG = {
  PENDING:    { cls: 'badge-amber', icon: '◌', step: 1 },
  CONFIRMED:  { cls: 'badge-blue',  icon: '◉', step: 2 },
  PROCESSING: { cls: 'badge-blue',  icon: '◎', step: 2 },
  SHIPPED:    { cls: 'badge-coral', icon: '▶', step: 3 },
  DELIVERED:  { cls: 'badge-green', icon: '✓', step: 4 },
  CANCELLED:  { cls: 'badge-red',   icon: '✕', step: 0 },
}

const STEPS = ['Confirmed', 'Processing', 'Shipped', 'Delivered']

function StatusBar({ status }) {
  const config = STATUS_CONFIG[status]
  if (!config || config.step === 0) return null
  const pct = ((config.step - 1) / (STEPS.length - 1)) * 100

  return (
    <div className="mt-4 mb-1">
      <div className="flex justify-between mb-2">
        {STEPS.map((label, i) => (
          <span
            key={label}
            className="text-[9px] uppercase tracking-wider"
            style={{
              color: i < config.step ? 'rgba(255,77,46,0.7)' : 'rgba(255,255,255,0.15)',
              letterSpacing: '0.12em',
            }}
          >
            {label}
          </span>
        ))}
      </div>
      <div className="relative h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #ff4d2e, #ff8c35)',
            boxShadow: '0 0 8px rgba(255,77,46,0.4)',
          }}
        />
      </div>
    </div>
  )
}

export default function OrdersPage() {
  const { userId } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchParams] = useSearchParams()
  const newOrderId = searchParams.get('newOrder')

  useEffect(() => {
    if (!userId) return
    orderApi.myOrders(userId)
      .then(data => setOrders(data.content || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [userId])

  if (loading) return (
    <div className="page-container max-w-3xl space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="glass p-6 space-y-3">
          <div className="skeleton h-4 w-28 rounded" />
          <div className="skeleton h-3 w-20 rounded" />
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-1 w-full rounded-full mt-2" />
        </div>
      ))}
    </div>
  )

  return (
    <div className="page-container max-w-3xl">

      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title">My Orders</h1>
        {orders.length > 0 && (
          <p className="text-void-700 text-sm mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''} total</p>
        )}
      </div>

      {/* Success banner */}
      {newOrderId && (
        <div
          className="flex items-center gap-3 px-5 py-3.5 rounded-2xl mb-6 animate-fade-up"
          style={{
            background: 'rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.2)',
            boxShadow: '0 0 24px rgba(16,185,129,0.08)',
          }}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', fontSize: '0.7rem' }}
          >
            ✓
          </div>
          <div>
            <p className="text-emerald-400 text-sm font-medium">Order placed successfully!</p>
            <p className="text-void-600 text-xs mt-0.5">Order #{newOrderId} is being processed.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="text-center py-12 text-red-400 text-sm">{error}</div>
      )}

      {!error && orders.length === 0 && (
        <div className="text-center py-24">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: '1.5rem', color: '#44445e' }}>
            No orders yet
          </p>
          <p className="text-void-700 text-sm mt-2">Start shopping to see your orders here.</p>
        </div>
      )}

      <div className="space-y-3">
        {orders.map((order, i) => {
          const config = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.PENDING
          const date = new Date(order.createdAt)
          return (
            <div
              key={order.id}
              className="animate-fade-up"
              style={{
                animationDelay: `${i * 60}ms`,
                background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '1.25rem',
                padding: '1.5rem',
                boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
              }}
            >
              {/* Order header row */}
              <div className="flex items-start justify-between gap-3 mb-1">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-medium text-void-200 text-sm">Order #{order.id}</span>
                    <span className={config.cls}>{config.icon} {order.status}</span>
                  </div>
                  <p className="text-[11px] mt-1" style={{ color: 'rgba(255,255,255,0.22)' }}>
                    {date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {' · '}
                    {date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <span className="price font-medium text-void-100 flex-shrink-0">
                  ${Number(order.totalAmount).toFixed(2)}
                </span>
              </div>

              {/* Progress bar */}
              <StatusBar status={order.status} />

              {/* Items */}
              {order.items?.length > 0 && (
                <ul
                  className="space-y-1.5 pt-4 mt-4"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
                >
                  {order.items.map(item => (
                    <li key={item.id} className="flex justify-between text-xs">
                      <span style={{ color: 'rgba(255,255,255,0.35)' }}>
                        {item.productName}
                        <span style={{ color: 'rgba(255,255,255,0.18)' }}> × {item.quantity}</span>
                      </span>
                      <span className="price" style={{ color: 'rgba(255,255,255,0.35)' }}>
                        ${Number(item.totalPrice).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Shipping address */}
              {order.shippingAddress && (
                <div className="flex items-start gap-2 mt-3">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.8" style={{ marginTop: '1px', flexShrink: 0 }}>
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    <circle cx="12" cy="9" r="2.5"/>
                  </svg>
                  <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
                    {order.shippingAddress}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
