import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { productApi } from '../services/api'
import { useCart } from '../context/CartContext'

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    productApi.getById(id)
      .then(setProduct)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = async () => {
    await addItem(product.id, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
      <div className="h-64 bg-gray-200 rounded mb-4" />
    </div>
  )

  if (error) return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-center">
      <p className="text-red-500 mb-4">{error}</p>
      <Link to="/" className="btn-primary">← Back to products</Link>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/" className="text-sm text-gray-500 hover:text-brand-600 mb-6 inline-block">
        ← Back to products
      </Link>

      <div className="card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-8">
          <div className="bg-gray-100 rounded-xl h-48 w-full sm:w-64 flex-shrink-0 flex items-center justify-center text-6xl">
            {product.categoryName === 'Electronics' ? '💻' :
             product.categoryName === 'Books' ? '📚' :
             product.categoryName === 'Sports' ? '🏋️' : '📦'}
          </div>

          <div className="flex-1">
            {product.categoryName && (
              <span className="badge-blue mb-2">{product.categoryName}</span>
            )}
            <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-3">{product.name}</h1>
            <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-gray-900">
                ${Number(product.price).toFixed(2)}
              </span>
              <span className={product.inStock ? 'badge-green' : 'badge-red'}>
                {product.inStock ? `${product.stockQuantity} in stock` : 'Out of stock'}
              </span>
            </div>

            {product.inStock && (
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    className="px-3 py-2 text-gray-500 hover:bg-gray-50"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  >−</button>
                  <span className="px-4 py-2 text-sm font-medium border-x border-gray-300">{quantity}</span>
                  <button
                    className="px-3 py-2 text-gray-500 hover:bg-gray-50"
                    onClick={() => setQuantity(q => Math.min(product.stockQuantity, q + 1))}
                  >+</button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="btn-primary flex-1"
                >
                  {added ? '✓ Added to cart!' : 'Add to Cart'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
