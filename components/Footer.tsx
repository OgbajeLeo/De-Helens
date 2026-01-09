'use client';

import { motion } from 'framer-motion';
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube } from 'react-icons/fi';
import Image from 'next/image';
import logo from "../app/logo.png"

export default function Footer() {
  return (
    <footer className="bg-[#0a2815] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Branding Column */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Image
                src={logo}
                alt="De Helen's Taste"
                width={120}
                height={100}
              />
            </div>
            <p className="text-gray-400 mb-4">
              Savor the artistry where every dish is a culinary masterpiece.
            </p>
            <div className="flex gap-3">
              {[
                { icon: FiFacebook, href: "#" },
                { icon: FiInstagram, href: "#" },
                { icon: FiTwitter, href: "#" },
                { icon: FiYoutube, href: "#" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-[#22c55e] rounded-full flex items-center justify-center hover:bg-[#16a34a] transition"
                >
                  <social.icon />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Useful Links Column */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold mb-4">Useful links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/#about" className="hover:text-[#22c55e] transition">
                  About us
                </a>
              </li>
              <li>
                <a
                  href="/#services"
                  className="hover:text-[#22c55e] transition"
                >
                  Events
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#22c55e] transition">
                  Blogs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#22c55e] transition">
                  FAQ
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Main Menu Column */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold mb-4">Main Menu</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/#home" className="hover:text-[#22c55e] transition">
                  Home
                </a>
              </li>
              <li>
                <a href="/#offers" className="hover:text-[#22c55e] transition">
                  Offers
                </a>
              </li>
              <li>
                <a href="/#menu" className="hover:text-[#22c55e] transition">
                  Menus
                </a>
              </li>
              <li>
                <a href="/#contact" className="hover:text-[#22c55e] transition">
                  Reservation
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Contact Column */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a
                  href="mailto:example@email.com"
                  className="hover:text-[#22c55e] transition"
                >
                  dehelenstaste@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+64958248966"
                  className="hover:text-[#22c55e] transition"
                >
                  +234 81 0675 2355
                </a>
              </li>
              <li className="hover:text-[#22c55e] transition cursor-pointer">
              Opposite TEC construction company Workers village, Zone 8 Lokoja, kogi state.
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="border-t border-gray-800 pt-6 text-center text-gray-400"
        >
          <p>
            Copyright © {new Date().getFullYear()} De Helen's Taste | All rights reserved.
          </p>
          <p>Built with 🖤 by <a href="https://www.linkedin.com/in/Ogbajeleo/" className="text-[#22c55e] hover:text-[#16a34a] transition">Lee</a></p>
        </motion.div>
      </div>
    </footer>
  );
}
