'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { FiShoppingCart, FiChevronDown } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function Header() {
  const { getItemCount } = useCart();

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-sm sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-3xl font-bold text-[#22c55e] flex items-center gap-2"
            >
              <span>🍃</span>
              <span>FOODI</span>
            </motion.div>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/#home" className="text-gray-700 hover:text-[#22c55e] transition font-medium text-[#22c55e]">
              Home
            </Link>
            <Link href="/#menu" className="text-gray-700 hover:text-[#22c55e] transition font-medium flex items-center gap-1">
              Menu <FiChevronDown className="text-xs" />
            </Link>
            <Link href="/#services" className="text-gray-700 hover:text-[#22c55e] transition font-medium flex items-center gap-1">
              Services <FiChevronDown className="text-xs" />
            </Link>
            <Link href="/#offers" className="text-gray-700 hover:text-[#22c55e] transition font-medium">
              Offers
            </Link>
          </nav>

          {/* Right side cart icon */}
          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-700 hover:text-[#22c55e] transition"
              >
                <FiShoppingCart className="text-xl" />
              </motion.button>
              {getItemCount() > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-[#22c55e] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold"
                >
                  {getItemCount()}
                </motion.span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
