'use client';

import { useRouter } from 'next/navigation';
import { MenuItem } from '@/lib/models';
import { useCart } from '@/context/CartContext';
import { FiPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface MenuSectionProps {
  title: string;
  items: MenuItem[];
  category: 'meal' | 'drink';
}

export default function MenuSection({ title, items, category }: MenuSectionProps) {
  const router = useRouter();
  const { addToCart, cart } = useCart();

  const isItemInCart = (itemId?: string) => {
    return cart.some((cartItem) => cartItem._id === itemId);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <section id={category === 'meal' ? 'meals' : 'drinks'} className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-12 text-[#22c55e]"
        >
          {title}
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
            >
              {item.image ? (
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  <motion.img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              ) : (
                <div className="h-48 bg-gray-200 flex items-center justify-center text-6xl">
                  🍽️
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{item.name}</h3>
                <p className="text-gray-600 mb-4 text-sm">{item.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-[#22c55e]">
                    ₦{item.price.toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-2">
                  {isItemInCart(item._id) ? (
                    <button
                      disabled
                      className="flex-1 bg-gray-300 text-gray-600 px-4 py-2 rounded-lg cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
                    >
                      Added
                    </button>
                  ) : (
                    <motion.button
                      onClick={() => {
                        addToCart(item);
                        toast.success(`${item.name} added to cart!`);
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2 font-semibold"
                    >
                      <FiPlus />
                      Add to Cart
                    </motion.button>
                  )}
                  <motion.button
                    onClick={() => {
                      if (!isItemInCart(item._id)) {
                        addToCart(item);
                      }
                      router.push('/checkout');
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-[#22c55e] text-white px-4 py-2 rounded-lg hover:bg-[#16a34a] transition font-semibold"
                  >
                    Order Now
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
