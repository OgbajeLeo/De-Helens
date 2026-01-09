'use client';

import { useCart } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { FiMinus, FiPlus, FiTrash2, FiArrowLeft } from 'react-icons/fi';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, getTotal, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Add some delicious items to get started!</p>
            <Link
              href="/"
              className="bg-[#228B22] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#1a6b1a] transition inline-block"
            >
              Browse Menu
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-600 hover:text-[#228B22] mb-6 transition"
        >
          <FiArrowLeft />
          Continue Shopping
        </Link>
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Your Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-4 py-4 border-b border-gray-200 last:border-0"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-3xl">
                      🍽️
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                    <p className="text-lg font-bold text-[#22c55e] mt-2">
                      ₦{item.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item._id!, item.quantity - 1)}
                      className="bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition"
                    >
                      <FiMinus />
                    </button>
                    <span className="text-lg font-semibold w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id!, item.quantity + 1)}
                      className="bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition"
                    >
                      <FiPlus />
                    </button>
                    <button
                      onClick={() => removeFromCart(item._id!)}
                      className="bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-2 transition ml-4"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={clearCart}
                className="mt-4 text-red-600 hover:text-red-700 font-semibold"
              >
                Clear Cart
              </button>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Order Summary</h2>
              <div className="space-y-2 mb-4">
                {cart.map((item) => (
                  <div key={item._id} className="flex justify-between text-gray-600">
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>₦{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex justify-between text-2xl font-bold text-gray-800">
                  <span>Total:</span>
                  <span className="text-[#228B22]">₦{getTotal().toLocaleString()}</span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="block w-full bg-[#228B22] text-white text-center py-3 rounded-full text-lg font-semibold hover:bg-[#1a6b1a] transition"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
