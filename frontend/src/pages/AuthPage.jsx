import { useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AuthPage() {
  const { isAuthenticated, login, register } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) return <Navigate to="/" replace />

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(form.email, form.password)
      } else {
        if (form.password.length < 8) {
          setError('Password must be at least 8 characters')
          setLoading(false)
          return
        }
        await register(form.name, form.email, form.password)
      }
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-[calc(100vh-3.75rem)] flex items-stretch"
      style={{ background: '#08080e' }}
    >
      {/* Left decorative panel — visible on lg+ */}
      <div
        className="hidden lg:flex flex-col justify-between p-14 w-[45%] flex-shrink-0 relative overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, rgba(255,77,46,0.07) 0%, rgba(8,8,14,0) 50%, rgba(255,140,53,0.04) 100%)',
          borderRight: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {/* Decorative grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        {/* Glow */}
        <div className="absolute" style={{
          top: '20%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(255,77,46,0.12) 0%, transparent 70%)',
        }} />

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-16">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #ff4d2e, #ff8c35)' }}
            >
              <span style={{ fontFamily: 'Cormorant Garamond, serif', color: 'white', fontSize: '1.1rem', fontWeight: 300, fontStyle: 'italic' }}>S</span>
            </div>
            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: '1.1rem', letterSpacing: '0.08em', color: '#f2f2f7' }}>
              SHOP<em style={{ color: '#ff6b4e' }}>AI</em>
            </span>
          </Link>

          <div>
            <p className="eyebrow mb-4" style={{ letterSpacing: '0.2em', fontSize: '9px' }}>Spring AI · JWT Auth</p>
            <h2
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontWeight: 300,
                fontSize: '3rem',
                lineHeight: 1.1,
                color: '#f2f2f7',
                letterSpacing: '-0.02em',
              }}
            >
              A premium<br />
              <em style={{ color: '#ff6b4e', fontStyle: 'italic' }}>shopping</em><br />
              experience.
            </h2>
            <p className="mt-6 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 300, maxWidth: '280px' }}>
              Built with Spring Boot, Spring AI, and React 18. Full JWT authentication with role-based access.
            </p>
          </div>
        </div>

        {/* Feature list */}
        <div className="relative z-10 space-y-3">
          {[
            'AI-powered product search',
            'Real-time inventory tracking',
            'Secure JWT authentication',
            'Role-based admin dashboard',
          ].map((feat) => (
            <div key={feat} className="flex items-center gap-3">
              <span style={{ color: 'rgba(255,77,46,0.6)', fontSize: '0.6rem' }}>◆</span>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)', letterSpacing: '0.02em' }}>{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm animate-fade-up">

          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2.5 mb-10 lg:hidden">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #ff4d2e, #ff8c35)' }}
            >
              <span style={{ fontFamily: 'Cormorant Garamond, serif', color: 'white', fontSize: '1rem', fontStyle: 'italic' }}>S</span>
            </div>
            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: '1rem', letterSpacing: '0.08em', color: '#f2f2f7' }}>
              SHOP<em style={{ color: '#ff6b4e' }}>AI</em>
            </span>
          </Link>

          {/* Mode toggle */}
          <div className="flex mb-8"
               style={{
                 background: 'rgba(255,255,255,0.03)',
                 border: '1px solid rgba(255,255,255,0.07)',
                 borderRadius: '0.875rem',
                 padding: '3px',
               }}>
            {['login', 'register'].map(m => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setError('') }}
                className="flex-1 text-xs font-medium py-2 rounded-xl transition-all duration-200"
                style={{
                  background: mode === m ? 'rgba(255,255,255,0.07)' : 'transparent',
                  color: mode === m ? '#f2f2f7' : 'rgba(255,255,255,0.3)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  fontSize: '10px',
                }}
              >
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          {/* Title */}
          <div className="mb-7">
            <h1
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontWeight: 300,
                fontSize: '2rem',
                color: '#f2f2f7',
                letterSpacing: '-0.01em',
                lineHeight: 1.2,
              }}
            >
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {mode === 'login'
                ? 'Sign in to your account to continue.'
                : 'Join to start your shopping experience.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label htmlFor="name" className="label">Full name</label>
                <input
                  id="name"
                  type="text"
                  className="input"
                  placeholder="Maxwell Aboagye"
                  value={form.name}
                  onChange={set('name')}
                  required
                  autoComplete="name"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="label">Email address</label>
              <input
                id="email"
                type="email"
                className="input"
                placeholder="you@example.com"
                value={form.email}
                onChange={set('email')}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="label">Password</label>
              <input
                id="password"
                type="password"
                className="input"
                placeholder={mode === 'register' ? 'Minimum 8 characters' : '••••••••'}
                value={form.password}
                onChange={set('password')}
                required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
            </div>

            {error && (
              <div
                className="text-sm text-red-400 px-4 py-3 rounded-xl"
                style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)' }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary w-full py-3 mt-2"
              disabled={loading}
            >
              {loading
                ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity="0.3"/>
                      <path d="M21 12a9 9 0 00-9-9"/>
                    </svg>
                    Please wait…
                  </span>
                )
                : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Demo credentials */}
          {mode === 'login' && (
            <div
              className="mt-5 p-3.5"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '0.875rem',
              }}
            >
              <p className="text-[10px] uppercase tracking-[0.15em] mb-2" style={{ color: 'rgba(255,255,255,0.2)' }}>
                Demo credentials
              </p>
              <button
                type="button"
                onClick={() => setForm({ name: '', email: 'admin@store.com', password: 'admin123' })}
                className="w-full text-left text-xs px-2 py-1.5 rounded-lg transition-colors"
                style={{ color: 'rgba(255,255,255,0.3)' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#ff8c7e'; e.currentTarget.style.background = 'rgba(255,77,46,0.06)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; e.currentTarget.style.background = 'transparent' }}
              >
                Admin: admin@store.com / admin123
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
