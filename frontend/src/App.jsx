import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import OrdersPage from './pages/OrdersPage'
import AiChatPage from './pages/AiChatPage'

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="min-h-screen">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/chat" element={<AiChatPage />} />
            </Routes>
          </main>
        </div>
      </CartProvider>
    </BrowserRouter>
  )
}
