import React from 'react'

export default function QuantityControl({ quantity, onDecrement, onIncrement, min = 1, max = Infinity }) {
  return (
    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
      <button
        type="button"
        aria-label="Decrease quantity"
        className="px-3 py-2 text-gray-500 hover:bg-gray-50"
        onClick={onDecrement}
        disabled={quantity <= min}
      >
        −
      </button>
      <span className="px-4 py-2 text-sm font-medium border-x border-gray-300" aria-label={`Quantity: ${quantity}`}>
        {quantity}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        className="px-3 py-2 text-gray-500 hover:bg-gray-50"
        onClick={onIncrement}
        disabled={quantity >= max}
      >
        +
      </button>
    </div>
  )
}
