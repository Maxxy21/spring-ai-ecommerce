import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { cartApi } from '../services/api'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], totalItems: 0, totalAmount: 0 })
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    try {
      const data = await cartApi.get()
      setCart(data)
    } catch {
      // cart may not exist yet
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const addItem = async (productId, quantity = 1) => {
    setLoading(true)
    try {
      const data = await cartApi.addItem(productId, quantity)
      setCart(data)
    } finally {
      setLoading(false)
    }
  }

  const removeItem = async (productId) => {
    setLoading(true)
    try {
      const data = await cartApi.removeItem(productId)
      setCart(data)
    } finally {
      setLoading(false)
    }
  }

  const updateItem = async (productId, quantity) => {
    const data = await cartApi.updateItem(productId, quantity)
    setCart(data)
  }

  const clearCart = async () => {
    await cartApi.clear()
    setCart({ items: [], totalItems: 0, totalAmount: 0 })
  }

  return (
    <CartContext.Provider value={{ cart, loading, addItem, removeItem, updateItem, clearCart, refresh }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
