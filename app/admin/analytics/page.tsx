"use client";

import { MenuItem } from "@/lib/models";
import { FiTrendingUp, FiPackage, FiDollarSign, FiUsers } from "react-icons/fi";
import { useMenuItems } from "@/lib/hooks/useMenuItems";

export default function AnalyticsPage() {
  const { data: menuItems = [], isLoading: loading } = useMenuItems();

  const stats = {
    totalItems: menuItems.length,
    availableItems: menuItems.filter((item) => item.available).length,
    totalValue: menuItems.reduce((sum, item) => sum + item.price, 0),
    categories: {
      shawama: menuItems.filter((item) => item.category === "shawama").length,
      drinks: menuItems.filter((item) => item.category === "drinks").length,
      food: menuItems.filter((item) => item.category === "food").length,
      protein: menuItems.filter((item) => item.category === "protein").length,
    },
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-center text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Analytics</h1>
        <p className="text-gray-600">Overview of your menu and business metrics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Items</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalItems}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FiPackage className="text-2xl text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Available Items</p>
              <p className="text-3xl font-bold text-gray-800">
                {stats.availableItems}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FiTrendingUp className="text-2xl text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Menu Value</p>
              <p className="text-3xl font-bold text-gray-800">
                ₦{stats.totalValue.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FiDollarSign className="text-2xl text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Categories</p>
              <p className="text-3xl font-bold text-gray-800">4</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <FiUsers className="text-2xl text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Category Breakdown
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-sm text-orange-600 mb-1">Shawama</p>
            <p className="text-2xl font-bold text-orange-800">
              {stats.categories.shawama}
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-600 mb-1">Drinks</p>
            <p className="text-2xl font-bold text-blue-800">
              {stats.categories.drinks}
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-600 mb-1">Food</p>
            <p className="text-2xl font-bold text-green-800">
              {stats.categories.food}
            </p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm text-red-600 mb-1">Protein</p>
            <p className="text-2xl font-bold text-red-800">
              {stats.categories.protein}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Items */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Items</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Category
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Price
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {menuItems.slice(0, 4).map((item) => (
                <tr key={item._id} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-800">{item.name}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 capitalize">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-800">
                    ₦{item.price.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    {item.available ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                        Available
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
                        Unavailable
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
