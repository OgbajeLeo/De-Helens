"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MenuItem } from "@/lib/models";
import { useCart } from "@/context/CartContext";
import { FiPlus } from "react-icons/fi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useMenuItems } from "@/lib/hooks/useMenuItems";

type CategoryType = "shawama" | "drinks" | "food" | "protein" | "all";

interface MenuSectionProps {
  title: string;
}

const categoryLabels: Record<string, string> = {
  shawama: "Shawama",
  drinks: "Drinks",
  food: "Food",
  protein: "Protein",
};

const categoryColors: Record<string, string> = {
  shawama: "bg-orange-100 text-orange-700 border-orange-300",
  drinks: "bg-blue-100 text-blue-700 border-blue-300",
  food: "bg-green-100 text-green-700 border-green-300",
  protein: "bg-red-100 text-red-700 border-red-300",
};

export default function MenuSection({ title }: MenuSectionProps) {
  const router = useRouter();
  const { addToCart, cart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("all");
  const { data: items = [], isLoading, error } = useMenuItems();

  const isItemInCart = (itemId?: string) => {
    return cart.some((cartItem) => cartItem._id === itemId);
  };

  const categories: CategoryType[] = [
    "all",
    "shawama",
    "drinks",
    "food",
    "protein",
  ];

  const filteredItems =
    selectedCategory === "all"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading menu...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-red-600 text-lg">
              Error loading menu. Please try again later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-8 text-[#22c55e]"
        >
          {title}
        </motion.h2>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                selectedCategory === category
                  ? "bg-[#22c55e] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category === "all" ? "All" : categoryLabels[category]}
            </motion.button>
          ))}
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No items found in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
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
                  <div className="h-[200px] bg-gray-200 relative overflow-hidden">
                    <motion.img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    />
                    {/* Category Tag */}
                    <div
                      className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold border ${
                        categoryColors[item.category] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {categoryLabels[item.category] || item.category}
                    </div>
                  </div>
                ) : (
                  <div className="h-[200px] bg-gray-200 flex items-center justify-center text-6xl relative">
                    {/* Category Tag */}
                    <div
                      className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold border ${
                        categoryColors[item.category] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {categoryLabels[item.category] || item.category}
                    </div>
                  </div>
                )}
                <div className="p-3 lg:p-6">
                  <h3 className="text-lg lg:text-xl font-semibold mb-2 text-gray-900">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl lg:text-2xl font-bold text-[#22c55e]">
                      ₦{item.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col lg:flex-row gap-2">
                    {isItemInCart(item._id) ? (
                      <button
                        disabled
                        className="flex-1 text-sm lg:text-base bg-gray-300 text-gray-600 px-4 py-2 rounded-lg cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
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
                        className="flex-1 text-sm lg:text-base bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2 font-semibold"
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
                        router.push("/checkout");
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-[#22c55e] text-sm lg:text-base text-white px-4 py-2 rounded-lg hover:bg-[#16a34a] transition font-semibold"
                    >
                      Order Now
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
