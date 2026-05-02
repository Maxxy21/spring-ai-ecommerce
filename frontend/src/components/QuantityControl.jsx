export default function QuantityControl({ quantity, onDecrement, onIncrement, min = 1, max = Infinity }) {
  return (
    <div
      className="flex items-center overflow-hidden flex-shrink-0"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '0.625rem',
      }}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={onDecrement}
        disabled={quantity <= min}
        className="w-8 h-8 flex items-center justify-center text-base transition-all duration-150 disabled:opacity-25"
        style={{ color: 'rgba(255,255,255,0.4)' }}
        onMouseEnter={e => !e.currentTarget.disabled && (e.currentTarget.style.color = '#f2f2f7', e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)', e.currentTarget.style.background = 'transparent')}
      >
        −
      </button>
      <span
        className="h-8 flex items-center justify-center text-sm font-medium price"
        style={{
          color: '#f2f2f7',
          minWidth: '2.25rem',
          textAlign: 'center',
          borderLeft: '1px solid rgba(255,255,255,0.06)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
        aria-label={`Quantity: ${quantity}`}
      >
        {quantity}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={onIncrement}
        disabled={quantity >= max}
        className="w-8 h-8 flex items-center justify-center text-base transition-all duration-150 disabled:opacity-25"
        style={{ color: 'rgba(255,255,255,0.4)' }}
        onMouseEnter={e => !e.currentTarget.disabled && (e.currentTarget.style.color = '#f2f2f7', e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)', e.currentTarget.style.background = 'transparent')}
      >
        +
      </button>
    </div>
  )
}
