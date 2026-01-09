'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function CheckoutPage() {
  const { cart, getTotal, clearCart } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!customerName || !customerPhone) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      // Create order
      const orderData = {
        customerName,
        customerPhone,
        items: cart.map((item) => ({
          itemId: item._id!,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total: getTotal(),
      };

      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const ownerPhone = "+2348106752355";
      const orderItems = cart
        .map((item) => `${item.name} x${item.quantity} - ₦${(item.price * item.quantity).toLocaleString()}`)
        .join('\n');
      
      const message = `New Order from De Helen's Taste\n\n` +
        `Customer: ${customerName}\n` +
        `Phone: ${customerPhone}\n\n` +
        `Items:\n${orderItems}\n\n` +
        `Total: ₦${getTotal().toLocaleString()}`;

      // Encode message for WhatsApp URL
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${ownerPhone}?text=${encodedMessage}`;

      // Open WhatsApp
      window.open(whatsappUrl, '_blank');

      // Clear cart
      clearCart();
      setSuccess(true);
    } catch (err) {
      setError('Failed to process order. Please try again.');
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && !success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">Your Cart is Empty</h1>
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

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center py-20">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-4 text-gray-800">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-8">
              Your order has been sent via WhatsApp. We&apos;ll contact you soon to confirm your order.
            </p>
            <Link
              href="/"
              className="bg-[#228B22] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#1a6b1a] transition inline-block"
            >
              Continue Shopping
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
          href="/cart"
          className="flex items-center gap-2 text-gray-600 hover:text-[#228B22] mb-6 transition"
        >
          <FiArrowLeft />
          Back to Cart
        </Link>
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Customer Information</h2>
            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#228B22] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#228B22] focus:border-transparent"
                  required
                />
              </div>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#228B22] text-white py-3 rounded-lg text-lg font-semibold hover:bg-[#1a6b1a] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Complete Order via WhatsApp'}
              </button>
            </form>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {cart.map((item) => (
                <div key={item._id} className="flex items-center gap-3 pb-3 border-b border-gray-200 last:border-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-2xl">
                      🍽️
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">x{item.quantity}</p>
                  </div>
                  <span className="font-semibold text-gray-800">₦{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-2xl font-bold text-gray-800">
                <span>Total:</span>
                <span className="text-[#228B22]">₦{getTotal().toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
