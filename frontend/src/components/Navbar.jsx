import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { cart } = useCart()
  const { pathname } = useLocation()

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        pathname === to
          ? 'bg-brand-100 text-brand-700'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      {label}
    </Link>
  )

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🛍️</span>
            <span className="font-bold text-gray-900">ShopAI</span>
            <span className="text-xs text-brand-600 font-medium bg-brand-50 px-2 py-0.5 rounded-full">Spring AI</span>
          </Link>

          <nav className="flex items-center gap-1">
            {navLink('/', 'Products')}
            {navLink('/chat', '🤖 AI Assistant')}
            {navLink('/orders', 'My Orders')}
            <Link
              to="/cart"
              className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/cart'
                  ? 'bg-brand-100 text-brand-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              🛒 Cart
              {cart.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.totalItems}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
