/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        void: {
          50:  '#f2f2f7',
          100: '#e4e4ed',
          200: '#c8c8db',
          300: '#9494b3',
          400: '#6b6b8f',
          500: '#44445e',
          600: '#2a2a3d',
          700: '#1a1a28',
          800: '#111118',
          900: '#08080e',
          950: '#04040a',
        },
        coral: {
          50:  '#fff2f0',
          100: '#ffddd8',
          200: '#ffb8af',
          300: '#ff8c7e',
          400: '#ff6b4e',
          500: '#ff4d2e',
          600: '#f03015',
          700: '#c7240f',
          800: '#a01f0e',
          900: '#7a1a0b',
        },
        ember: {
          400: '#ffad5e',
          500: '#ff8c35',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:    ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono:    ['"Geist Mono"', '"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'coral-gradient': 'linear-gradient(135deg, #ff4d2e 0%, #ff8c35 100%)',
        'void-gradient':  'linear-gradient(180deg, #08080e 0%, #111118 100%)',
        'glass-shine':    'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%)',
      },
      boxShadow: {
        'glass':       '0 0 0 1px rgba(255,255,255,0.06), 0 4px 32px rgba(0,0,0,0.5)',
        'glass-lg':    '0 0 0 1px rgba(255,255,255,0.06), 0 8px 48px rgba(0,0,0,0.6)',
        'coral-glow':  '0 0 40px rgba(255,77,46,0.25)',
        'coral-sm':    '0 0 16px rgba(255,77,46,0.2)',
        'coral-lg':    '0 0 60px rgba(255,77,46,0.3)',
      },
      animation: {
        'fade-up':      'fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in':      'fadeIn 0.4s ease both',
        'slide-right':  'slideInRight 0.4s cubic-bezier(0.16,1,0.3,1) both',
        'shimmer':      'shimmer 1.8s infinite linear',
        'pulse-dot':    'pulseDot 1.4s ease-in-out infinite',
        'float-glow':   'floatGlow 3s ease-in-out infinite',
        'border-pulse': 'borderPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to:   { opacity: 1 },
        },
        slideInRight: {
          from: { opacity: 0, transform: 'translateX(16px)' },
          to:   { opacity: 1, transform: 'translateX(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseDot: {
          '0%, 80%, 100%': { transform: 'scale(0)', opacity: 0.3 },
          '40%':           { transform: 'scale(1)', opacity: 1 },
        },
        floatGlow: {
          '0%, 100%': { boxShadow: '0 0 24px rgba(255,77,46,0.2)' },
          '50%':      { boxShadow: '0 0 48px rgba(255,77,46,0.4)' },
        },
        borderPulse: {
          '0%, 100%': { borderColor: 'rgba(255,77,46,0.2)' },
          '50%':      { borderColor: 'rgba(255,77,46,0.5)' },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
