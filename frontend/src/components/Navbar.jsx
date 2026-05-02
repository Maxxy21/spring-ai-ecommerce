import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { cart } = useCart()
  const { user, isAdmin, isAuthenticated, logout } = useAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false) }
  const isActive = (path) => pathname === path

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? 'rgba(8,8,14,0.92)'
          : 'rgba(8,8,14,0.6)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.5)' : 'none',
      }}
    >
      {/* Top accent line */}
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,77,46,0.6) 30%, rgba(255,140,53,0.4) 70%, transparent)', opacity: 0.7 }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15" style={{ height: '3.75rem' }}>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" aria-label="ShopAI home">
            <div
              className="relative w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #ff4d2e, #ff8c35)' }}
            >
              <span
                className="text-white font-light text-lg leading-none"
                style={{ fontFamily: 'Cormorant Garamond, serif', paddingTop: '1px' }}
              >
                S
              </span>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
            <div className="flex items-baseline gap-2">
              <span
                className="font-light text-void-100 tracking-wide text-base group-hover:text-white transition-colors duration-200"
                style={{ fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.06em' }}
              >
                SHOP<span style={{ color: '#ff6b4e', fontStyle: 'italic' }}>AI</span>
              </span>
              <span className="hidden sm:block text-[9px] text-void-600 font-medium uppercase tracking-[0.18em] border border-void-700 rounded px-1.5 py-0.5">
                Spring AI
              </span>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-0.5" aria-label="Main navigation">
            <Link to="/" className={isActive('/') ? 'nav-link-active' : 'nav-link'}>Products</Link>
            <Link to="/chat" className={isActive('/chat') ? 'nav-link-active' : 'nav-link'}>AI Assistant</Link>
            {isAuthenticated && (
              <Link to="/orders" className={isActive('/orders') ? 'nav-link-active' : 'nav-link'}>Orders</Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className={`${isActive('/admin') ? 'nav-link-active' : 'nav-link'} flex items-center gap-1.5`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-coral-500 opacity-80" />
                <span className={isActive('/admin') ? '' : 'text-coral-500/80'}>Admin</span>
              </Link>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-1">
            {/* Cart */}
            {isAuthenticated && (
              <Link
                to="/cart"
                aria-label={`Shopping cart, ${cart.totalItems} items`}
                className={`relative btn-ghost ${isActive('/cart') ? 'text-coral-400' : ''}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                {cart.totalItems > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] flex items-center justify-center
                               text-[9px] font-bold text-white rounded-full px-0.5"
                    style={{ background: 'linear-gradient(135deg, #ff4d2e, #ff8c35)' }}
                  >
                    {cart.totalItems > 99 ? '99+' : cart.totalItems}
                  </span>
                )}
              </Link>
            )}

            {/* Auth */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 btn-ghost pl-2"
                  aria-label="User menu"
                  aria-expanded={menuOpen}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #ff4d2e, #ff8c35)' }}
                  >
                    {user?.name?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                  <span className="hidden sm:block text-void-300 text-sm max-w-[80px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <svg
                    width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"
                    className={`text-void-600 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`}
                  >
                    <path d="M2 4l4 4 4-4"/>
                  </svg>
                </button>

                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                    <div
                      className="absolute right-0 mt-2 w-52 z-20 py-1.5 overflow-hidden animate-fade-in"
                      style={{
                        background: 'rgba(10,10,18,0.96)',
                        border: '1px solid rgba(255,255,255,0.09)',
                        borderRadius: '1rem',
                        boxShadow: '0 8px 48px rgba(0,0,0,0.7), 0 0 0 0.5px rgba(255,255,255,0.04) inset',
                        backdropFilter: 'blur(20px)',
                      }}
                    >
                      <div className="px-4 py-2.5 border-b border-white/[0.05] mb-1">
                        <p className="text-xs text-void-100 font-medium truncate">{user?.name}</p>
                        <p className="text-[10px] text-void-600 truncate mt-0.5">{user?.email}</p>
                        <span className="eyebrow mt-1 inline-block" style={{ fontSize: '9px' }}>{user?.role}</span>
                      </div>

                      <Link
                        to="/orders"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-void-400 hover:text-void-100 hover:bg-white/[0.04] transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        My Orders
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-coral-400 hover:bg-white/[0.04] transition-colors"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                          Admin Dashboard
                        </Link>
                      )}

                      <div className="border-t border-white/[0.05] mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-void-500 hover:text-red-400 hover:bg-white/[0.04] transition-colors"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
                          </svg>
                          Sign out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link to="/auth" className="btn-primary text-xs px-4 py-2 ml-1">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
