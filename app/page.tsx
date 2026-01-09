"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MenuSection from "@/components/MenuSection";
import { MenuItem } from "@/lib/models";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import {
  FiPlay,
  FiChevronLeft,
  FiChevronRight,
  FiStar,
  FiPlus,
} from "react-icons/fi";
import {
  FiCoffee,
  FiShoppingBag,
  FiTruck,
  FiGift,
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiYoutube,
} from "react-icons/fi";
import toast from "react-hot-toast";

export default function Home() {
  const router = useRouter();
  const { addToCart, cart } = useCart();
  const [allItems, setAllItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDishIndex, setCurrentDishIndex] = useState(0);

  const isItemInCart = (itemId?: string) => {
    return cart.some((cartItem) => cartItem._id === itemId);
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await fetch("/api/menu");
      const data = await response.json();
      setAllItems(data);
    } catch (error) {
      console.error("Error fetching menu:", error);
    } finally {
      setLoading(false);
    }
  };

  const featuredDishes = allItems.slice(0, 6);
  const specialDishes = featuredDishes.slice(
    currentDishIndex,
    currentDishIndex + 3
  );

  const nextDishes = () => {
    setCurrentDishIndex((prev) =>
      prev + 3 >= featuredDishes.length ? 0 : prev + 3
    );
  };

  const prevDishes = () => {
    setCurrentDishIndex((prev) =>
      prev - 3 < 0 ? Math.max(0, featuredDishes.length - 3) : prev - 3
    );
  };

  const getCategoryCount = (category: string) => {
    return allItems.filter((item) => item.category === category).length;
  };

  const categories = [
    {
      name: "Shawama",
      icon: "🌯",
      count: getCategoryCount("shawama"),
      id: "shawama",
    },
    {
      name: "Drinks",
      icon: "🥤",
      count: getCategoryCount("drinks"),
      id: "drinks",
    },
    { name: "Food", icon: "🍔", count: getCategoryCount("food"), id: "food" },
    {
      name: "Protein",
      icon: "🍗",
      count: getCategoryCount("protein"),
      id: "protein",
    },
  ];

  const services = [
    {
      icon: <FiCoffee className="text-3xl" />,
      title: "CATERING",
      description: "Professional catering services for your events",
    },
    {
      icon: <FiTruck className="text-3xl" />,
      title: "FAST DELIVERY",
      description: "Quick and reliable delivery to your doorstep",
    },
    {
      icon: <FiShoppingBag className="text-3xl" />,
      title: "ONLINE ORDERING",
      description: "Easy online ordering system",
    },
    {
      icon: <FiGift className="text-3xl" />,
      title: "GIFT CARDS",
      description: "Perfect gift for food lovers",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="grow">
        {/* Hero Section */}
        <section id="home" className="py-20 bg-white overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left side - Text content */}
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight"
                >
                  Dive into Delights Of{" "}
                  <span className="text-[#22c55e]">Delectable Food</span>
                </motion.h1>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-lg text-gray-600 leading-relaxed"
                >
                  Where Each Plate Weaves a Story of Culinary Mastery and
                  Passionate Craftsmanship.
                </motion.p>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="flex gap-4"
                >
                  <motion.a
                    href="#menu"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#22c55e] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#16a34a] transition"
                  >
                    Order Now
                  </motion.a>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-gray-800 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-gray-300 hover:border-[#22c55e] transition flex items-center gap-2"
                  >
                    <FiPlay className="text-xl" />
                    Watch Video
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* Right side - Hero Image */}
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="relative z-10">
                  <div className="w-full h-[500px] bg-gradient-to-br from-[#22c55e] to-[#16a34a] rounded-full opacity-20 absolute -z-10 -top-20 -right-20 blur-3xl"></div>
                  <div className="bg-gray-200 rounded-2xl overflow-hidden h-[500px] flex items-center justify-center">
                    <div className="text-6xl">👩‍🍳</div>
                  </div>
                </div>

                {/* Overlay Cards */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
                  className="absolute top-10 right-10 bg-white rounded-lg shadow-xl p-3 flex items-center gap-3"
                >
                  <div className="text-2xl">🔥</div>
                  <span className="font-semibold text-red-600">
                    Hot spicy Food
                  </span>
                </motion.div>

                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5, type: "spring" }}
                  className="absolute bottom-20 right-10 bg-white rounded-lg shadow-xl p-4 w-48"
                >
                  <div className="w-full h-24 bg-gray-200 rounded mb-2"></div>
                  <h4 className="font-semibold text-sm mb-1">Spicy noodles</h4>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className="text-yellow-400 fill-yellow-400 text-xs"
                      />
                    ))}
                  </div>
                  <p className="text-[#22c55e] font-bold">₦18,000</p>
                </motion.div>

                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.5, type: "spring" }}
                  className="absolute bottom-10 left-10 bg-white rounded-lg shadow-xl p-4 w-48"
                >
                  <div className="w-full h-24 bg-gray-200 rounded mb-2"></div>
                  <h4 className="font-semibold text-sm mb-1">
                    Vegetarian salad
                  </h4>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className="text-yellow-400 fill-yellow-400 text-xs"
                      />
                    ))}
                  </div>
                  <p className="text-[#22c55e] font-bold">₦23,000</p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Popular Categories Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <p className="text-red-600 text-sm font-semibold mb-2">
                CUSTOMER FAVORITES
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                Popular Categories
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="bg-white rounded-xl shadow-md p-6 text-center cursor-pointer hover:shadow-xl transition"
                >
                  <div className="w-20 h-20 bg-[#22c55e] rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    ({category.count} dishes)
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Special Dishes Section */}
        <section id="menu" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-red-600 text-sm font-semibold mb-2">
                  SPECIAL DISHES
                </p>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                  Standout Dishes From Our Menu
                </h2>
              </motion.div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prevDishes}
                  className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center hover:bg-[#22c55e] hover:text-white transition"
                >
                  <FiChevronLeft />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextDishes}
                  className="w-12 h-12 rounded-full bg-[#22c55e] text-white flex items-center justify-center hover:bg-[#16a34a] transition"
                >
                  <FiChevronRight />
                </motion.button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-16">
                <p className="text-gray-600">Loading menu...</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {specialDishes.map((dish, index) => (
                  <motion.div
                    key={dish._id}
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ y: -10 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
                  >
                    <div className="relative h-[200px] bg-gray-200">
                      {dish.image ? (
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                          🍽️
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {dish.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {dish.description || "Description of the item"}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-[#22c55e]">
                          ₦{dish.price.toLocaleString()}
                        </span>
                        <div className="flex items-center gap-1">
                          <FiStar className="text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-semibold">4.9</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {isItemInCart(dish._id) ? (
                          <button
                            disabled
                            className="flex-1 bg-gray-300 text-gray-600 px-4 py-2 rounded-lg cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
                          >
                            Added
                          </button>
                        ) : (
                          <motion.button
                            onClick={() => {
                              addToCart(dish);
                              toast.success(`${dish.name} added to cart!`);
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
                            if (!isItemInCart(dish._id)) {
                              addToCart(dish);
                            }
                            router.push("/checkout");
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
            )}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="w-full h-[400px] bg-gradient-to-br from-[#22c55e] to-[#16a34a] rounded-full opacity-20 absolute -z-10 -bottom-20 -left-20 blur-3xl"></div>
                <div className="bg-gray-200 rounded-2xl overflow-hidden h-[400px] flex items-center justify-center">
                  <div className="text-6xl">👨‍🍳</div>
                </div>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
                  className="absolute bottom-10 left-10 bg-white rounded-lg shadow-xl p-3"
                >
                  <span className="font-semibold text-gray-800">
                    Our Best Chef 😊
                  </span>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <div>
                  <p className="text-red-600 text-sm font-semibold mb-2">
                    TESTIMONIALS
                  </p>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                    What Our Customers Say About Us
                  </h2>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  &quot;I had the pleasure of dining at Foodi last night, and
                  I&apos;m still raving about the experience! The attention to
                  detail in presentation and service was impeccable.&quot;
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="w-12 h-12 rounded-full bg-gray-300 border-2 border-white"
                      ></div>
                    ))}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Customer Feedback
                    </p>
                    <div className="flex items-center gap-1">
                      <FiStar className="text-yellow-400 fill-yellow-400" />
                      <span className="font-semibold">4.9</span>
                      <span className="text-gray-600 text-sm">
                        (18.6k Reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Story & Services Section */}
        <section id="services" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 max-w-3xl mx-auto"
            >
              <p className="text-red-600 text-sm font-semibold mb-2">
                OUR STORY & SERVICES
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Our Culinary Journey And Services
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                We are passionate about creating exceptional culinary
                experiences. Our journey began with a simple mission: to serve
                delicious, high-quality food that brings people together. Every
                dish we create is a testament to our commitment to excellence
                and our love for the art of cooking.
              </p>
              <motion.a
                href="#menu"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block bg-[#22c55e] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#16a34a] transition"
              >
                Explore
              </motion.a>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition"
                >
                  <div className="w-16 h-16 bg-[#22c55e] rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                    {service.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Menu Sections */}
        {!loading && <MenuSection title="Our Menu" items={allItems} />}
      </main>
      <Footer />
    </div>
  );
}
