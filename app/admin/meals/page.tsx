"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MenuItem } from "@/lib/models";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";

export default function MealsPage() {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "food" as "shawama" | "drinks" | "food" | "protein",
    image: "",
    available: true,
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch("/api/menu");
      const data = await response.json();
      const itemsWithIds = data.map((item: any) => ({
        ...item,
        _id: item._id || item.id || "",
      }));
      setMenuItems(itemsWithIds);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      toast.error("Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        toast.success(
          "Menu item created successfully! It will appear on your website."
        );
        fetchMenuItems();
        resetForm();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create item");
      }
    } catch (error: any) {
      console.error("Error saving menu item:", error);
      toast.error(
        error.message || "Failed to save item. Check console for details."
      );
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setUploadingImage(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();

      if (data.url) {
        setFormData((prev) => ({ ...prev, image: data.url }));
        setImagePreview(data.url);
        toast.success("Image uploaded successfully!");
      } else {
        throw new Error("No URL returned from server");
      }
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(error.message || "Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
      const fileInput = e.target;
      if (fileInput) {
        fileInput.value = "";
      }
    }
  };

  const handleEdit = (item: MenuItem) => {
    router.push(`/admin/edit/${item._id}`);
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) {
      toast.error("Invalid item ID");
      return;
    }

    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await fetch(`/api/menu/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success("Menu item deleted successfully!");
        fetchMenuItems();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting menu item:", error);
      toast.error("Failed to delete item");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "food",
      image: "",
      available: true,
    });
    setImagePreview("");
    setShowForm(false);
  };

  const shawama = menuItems.filter((item) => item.category === "shawama");
  const drinks = menuItems.filter((item) => item.category === "drinks");
  const food = menuItems.filter((item) => item.category === "food");
  const protein = menuItems.filter((item) => item.category === "protein");

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-medium text-gray-800">Menu Management</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your menu items</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-[#228B22] text-white px-4 py-2 rounded-lg hover:bg-[#1a6b1a] transition text-sm font-medium"
        >
          <FiPlus className="text-sm" />
          Add Item
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
          <h3 className="text-base font-medium mb-3 text-gray-800">
            Add New Menu Item
          </h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#228B22] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Price (₦)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#228B22] focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#228B22] focus:border-transparent"
                rows={2}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as
                        | "shawama"
                        | "drinks"
                        | "food"
                        | "protein",
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#228B22] focus:border-transparent"
                >
                  <option value="shawama">Shawama</option>
                  <option value="drinks">Drinks</option>
                  <option value="food">Food</option>
                  <option value="protein">Protein</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Image
                </label>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Upload from device:
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#228B22] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    {uploadingImage && (
                      <p className="text-xs text-gray-500 mt-1">
                        Uploading image...
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-2 bg-gray-50 text-gray-500">OR</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Enter image URL:
                    </label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => {
                        setFormData({ ...formData, image: e.target.value });
                        setImagePreview(e.target.value);
                      }}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#228B22] focus:border-transparent"
                    />
                  </div>
                  {(imagePreview || formData.image) && (
                    <div className="mt-2">
                      <img
                        src={imagePreview || formData.image}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded border border-gray-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="available"
                checked={formData.available}
                onChange={(e) =>
                  setFormData({ ...formData, available: e.target.checked })
                }
                className="w-4 h-4"
              />
              <label
                htmlFor="available"
                className="text-xs font-medium text-gray-700"
              >
                Available
              </label>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="bg-[#228B22] text-white px-4 py-2 rounded-lg hover:bg-[#1a6b1a] transition text-sm font-medium"
              >
                Create
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-500 text-sm py-8">
          Loading menu items...
        </p>
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-medium mb-3 text-gray-700">
              Shawama{" "}
              <span className="text-gray-500 font-normal">
                ({shawama.length})
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {shawama.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-lg shadow-sm p-3 border border-gray-200 hover:shadow-md transition"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-28 object-cover rounded mb-2"
                    />
                  )}
                  <h4 className="font-medium text-sm mb-1 text-gray-800">
                    {item.name}
                  </h4>
                  <p className="text-gray-500 text-xs mb-2 line-clamp-2">
                    {item.description}
                  </p>
                  <p className="text-[#228B22] font-medium text-sm mb-2">
                    ₦{item.price.toLocaleString()}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 flex items-center justify-center gap-1 bg-[#FFD700] text-gray-800 px-2 py-1.5 rounded text-xs font-medium hover:bg-[#FFC700] transition"
                    >
                      <FiEdit className="text-xs" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id!)}
                      className="flex-1 flex items-center justify-center gap-1 bg-red-600 text-white px-2 py-1.5 rounded text-xs font-medium hover:bg-red-700 transition"
                    >
                      <FiTrash2 className="text-xs" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-base font-medium mb-3 text-gray-700">
              Drinks{" "}
              <span className="text-gray-500 font-normal">
                ({drinks.length})
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {drinks.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-lg shadow-sm p-3 border border-gray-200 hover:shadow-md transition"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-28 object-cover rounded mb-2"
                    />
                  )}
                  <h4 className="font-medium text-sm mb-1 text-gray-800">
                    {item.name}
                  </h4>
                  <p className="text-gray-500 text-xs mb-2 line-clamp-2">
                    {item.description}
                  </p>
                  <p className="text-[#228B22] font-medium text-sm mb-2">
                    ₦{item.price.toLocaleString()}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 flex items-center justify-center gap-1 bg-[#FFD700] text-gray-800 px-2 py-1.5 rounded text-xs font-medium hover:bg-[#FFC700] transition"
                    >
                      <FiEdit className="text-xs" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id!)}
                      className="flex-1 flex items-center justify-center gap-1 bg-red-600 text-white px-2 py-1.5 rounded text-xs font-medium hover:bg-red-700 transition"
                    >
                      <FiTrash2 className="text-xs" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-base font-medium mb-3 text-gray-700">
              Food{" "}
              <span className="text-gray-500 font-normal">({food.length})</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {food.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-lg shadow-sm p-3 border border-gray-200 hover:shadow-md transition"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-28 object-cover rounded mb-2"
                    />
                  )}
                  <h4 className="font-medium text-sm mb-1 text-gray-800">
                    {item.name}
                  </h4>
                  <p className="text-gray-500 text-xs mb-2 line-clamp-2">
                    {item.description}
                  </p>
                  <p className="text-[#228B22] font-medium text-sm mb-2">
                    ₦{item.price.toLocaleString()}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 flex items-center justify-center gap-1 bg-[#FFD700] text-gray-800 px-2 py-1.5 rounded text-xs font-medium hover:bg-[#FFC700] transition"
                    >
                      <FiEdit className="text-xs" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id!)}
                      className="flex-1 flex items-center justify-center gap-1 bg-red-600 text-white px-2 py-1.5 rounded text-xs font-medium hover:bg-red-700 transition"
                    >
                      <FiTrash2 className="text-xs" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-base font-medium mb-3 text-gray-700">
              Protein{" "}
              <span className="text-gray-500 font-normal">
                ({protein.length})
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {protein.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-lg shadow-sm p-3 border border-gray-200 hover:shadow-md transition"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-28 object-cover rounded mb-2"
                    />
                  )}
                  <h4 className="font-medium text-sm mb-1 text-gray-800">
                    {item.name}
                  </h4>
                  <p className="text-gray-500 text-xs mb-2 line-clamp-2">
                    {item.description}
                  </p>
                  <p className="text-[#228B22] font-medium text-sm mb-2">
                    ₦{item.price.toLocaleString()}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 flex items-center justify-center gap-1 bg-[#FFD700] text-gray-800 px-2 py-1.5 rounded text-xs font-medium hover:bg-[#FFC700] transition"
                    >
                      <FiEdit className="text-xs" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id!)}
                      className="flex-1 flex items-center justify-center gap-1 bg-red-600 text-white px-2 py-1.5 rounded text-xs font-medium hover:bg-red-700 transition"
                    >
                      <FiTrash2 className="text-xs" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
