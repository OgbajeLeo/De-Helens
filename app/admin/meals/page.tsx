"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { MenuItem } from "@/lib/models";
import { FiPlus, FiEdit, FiTrash2, FiChevronDown } from "react-icons/fi";
import toast from "react-hot-toast";
import {
  useAdminMenuItems,
  useCreateMenuItem,
  useDeleteMenuItem,
  useUploadImage,
} from "@/lib/hooks/useAdminMenu";

type CategoryFilter = "All" | "shawama" | "drinks" | "food" | "protein";

export default function MealsPage() {
  const router = useRouter();
  const {
    data: menuItems = [],
    isLoading: loading,
    error: fetchError,
  } = useAdminMenuItems();
  const createMenuItem = useCreateMenuItem();
  const deleteMenuItem = useDeleteMenuItem();
  const uploadImage = useUploadImage();

  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("All");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "food" as "shawama" | "drinks" | "food" | "protein",
    image: "",
    available: true,
  });
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createMenuItem.mutate(formData, {
      onSuccess: () => {
        resetForm();
      },
    });
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

    uploadImage.mutate(file, {
      onSuccess: (imageUrl) => {
        setFormData((prev) => ({ ...prev, image: imageUrl }));
        setImagePreview(imageUrl);
        toast.success("Image uploaded successfully!");
      },
    });

    // Reset file input
    const fileInput = e.target;
    if (fileInput) {
      fileInput.value = "";
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

    deleteMenuItem.mutate(id);
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

  const categories: { value: CategoryFilter; label: string }[] = [
    { value: "All", label: "All Categories" },
    { value: "shawama", label: "Shawama" },
    { value: "drinks", label: "Drinks" },
    { value: "food", label: "Food" },
    { value: "protein", label: "Protein" },
  ];

  const filteredItems =
    selectedCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  const getCategoryLabel = (value: CategoryFilter) => {
    return (
      categories.find((cat) => cat.value === value)?.label || "All Categories"
    );
  };

  const handleCategorySelect = (category: CategoryFilter) => {
    setSelectedCategory(category);
    setDropdownOpen(false);
  };

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
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadImage.isPending}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#228B22] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#228B22] file:text-white hover:file:bg-[#1a6b1a] file:cursor-pointer"
                />
                {uploadImage.isPending && (
                  <p className="text-xs text-[#228B22] font-medium mt-1 flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-[#228B22]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Uploading image...
                  </p>
                )}
                {imagePreview && !uploadImage.isPending && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-600 mb-2 font-medium">
                      Image Preview:
                    </p>
                    <div className="relative rounded-lg border border-gray-300 overflow-hidden bg-gray-50">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-40 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview("");
                          setFormData((prev) => ({ ...prev, image: "" }));
                        }}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 transition-colors shadow-sm"
                        title="Remove image"
                      >
                        <FiTrash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )}
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
                disabled={createMenuItem.isPending}
                className="bg-[#228B22] text-white px-4 py-2 rounded-lg hover:bg-[#1a6b1a] transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {createMenuItem.isPending && (
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                {createMenuItem.isPending ? "Creating..." : "Create"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                disabled={createMenuItem.isPending}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#228B22] mb-3"></div>
          <p className="text-gray-500 text-sm">Loading menu items...</p>
        </div>
      ) : fetchError ? (
        <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-600 text-sm font-medium mb-2">
            Failed to load menu items
          </p>
          <p className="text-red-500 text-xs">
            {fetchError.message || "Please try again later"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-medium"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Category Filter Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="relative w-full sm:w-64" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#228B22] focus:border-transparent transition-all"
              >
                <span>{getCategoryLabel(selectedCategory)}</span>
                <FiChevronDown
                  className={`ml-2 h-4 w-4 text-gray-500 transition-transform duration-200 ${
                    dropdownOpen ? "transform rotate-180" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {categories.map((category) => (
                    <button
                      key={category.value}
                      type="button"
                      onClick={() => handleCategorySelect(category.value)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        selectedCategory === category.value
                          ? "bg-[#228B22] text-white font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      } first:rounded-t-lg last:rounded-b-lg`}
                    >
                      {category.label}
                      {category.value !== "All" && (
                        <span className="ml-2 text-xs opacity-75">
                          (
                          {
                            menuItems.filter(
                              (item) => item.category === category.value
                            ).length
                          }
                          )
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-medium text-gray-800">
                {filteredItems.length}
              </span>{" "}
              {filteredItems.length === 1 ? "item" : "items"}
            </div>
          </div>

          {/* Menu Items Grid */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500 text-sm">
                No items found in this category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all overflow-hidden"
                >
                  {item.image && (
                    <div className="relative w-full h-40 bg-gray-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="mb-2">
                      <span className="inline-block px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                        {item.category.charAt(0).toUpperCase() +
                          item.category.slice(1)}
                      </span>
                    </div>
                    <h4 className="font-semibold text-base mb-1.5 text-gray-800 line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-gray-600 text-xs mb-3 line-clamp-2 min-h-10">
                      {item.description}
                    </p>
                    <p className="text-[#228B22] font-semibold text-lg mb-4">
                      ₦{item.price.toLocaleString()}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-[#FFD700] text-gray-800 px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#FFC700] transition-colors"
                      >
                        <FiEdit className="text-sm" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(item._id!)}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                      >
                        <FiTrash2 className="text-sm" />
                        <span>Delete</span>
                      </button>
                    </div>
                    {!item.available && (
                      <div className="mt-2 text-center">
                        <span className="inline-block px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded">
                          Unavailable
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
