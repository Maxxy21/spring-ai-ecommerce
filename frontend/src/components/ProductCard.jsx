import { memo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { categoryEmoji } from '../utils/categoryEmoji'

const ADDED_RESET_MS = 1500

function ProductCard({ product }) {
  const { addItem, loading } = useCart()
  const [added, setAdded] = useState(false)

  const handleAddToCart = async () => {
    await addItem(product.id, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), ADDED_RESET_MS)
  }

  return (
    <div className="card flex flex-col">
      <div
        className="bg-gray-100 h-40 flex items-center justify-center text-5xl"
        role="img"
        aria-label={product.categoryName ?? 'Product'}
      >
        {categoryEmoji(product.categoryName)}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <Link
            to={`/products/${product.id}`}
            className="text-sm font-semibold text-gray-900 hover:text-brand-600 line-clamp-2 leading-snug"
          >
            {product.name}
          </Link>
        </div>

        {product.categoryName && (
          <span className="text-xs text-gray-400 mb-2">{product.categoryName}</span>
        )}

        {product.description && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-3 flex-1">{product.description}</p>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
          <div>
            <span className="text-lg font-bold text-gray-900">${Number(product.price).toFixed(2)}</span>
            <span className={`ml-2 text-xs ${product.inStock ? 'badge-green' : 'badge-red'}`}>
              {product.inStock ? 'In stock' : 'Out of stock'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!product.inStock || loading}
            aria-label={`Add ${product.name} to cart`}
            className="btn-primary text-xs px-3 py-1.5"
          >
            {added ? '✓ Added' : '+ Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default memo(ProductCard)
