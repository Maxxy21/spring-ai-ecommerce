import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { cartApi } from '../services/api'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

const EMPTY_CART = { items: [], totalItems: 0, totalAmount: 0 }

export function CartProvider({ children }) {
  const { userId } = useAuth()
  const [cart, setCart] = useState(EMPTY_CART)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    if (!userId) { setCart(EMPTY_CART); return }
    try {
      const data = await cartApi.get(userId)
      setCart(data)
      setError(null)
    } catch {
      // cart may not exist yet for a new user
    }
  }, [userId])

  useEffect(() => { refresh() }, [refresh])

  const addItem = async (productId, quantity = 1) => {
    setLoading(true)
    setError(null)
    try {
      const data = await cartApi.addItem(userId, productId, quantity)
      setCart(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const removeItem = async (productId) => {
    setLoading(true)
    setError(null)
    try {
      const data = await cartApi.removeItem(userId, productId)
      setCart(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateItem = async (productId, quantity) => {
    setLoading(true)
    setError(null)
    try {
      const data = await cartApi.updateItem(userId, productId, quantity)
      setCart(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const clearCart = async () => {
    setLoading(true)
    try {
      await cartApi.clear(userId)
      setCart(EMPTY_CART)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <CartContext.Provider value={{ cart, loading, error, addItem, removeItem, updateItem, clearCart, refresh }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
