"use client";

import { useState, useEffect } from "react";
import {
  FiSave,
  FiBell,
  FiShield,
  FiGlobe,
  FiDollarSign,
  FiTruck,
  FiPlus,
  FiX,
} from "react-icons/fi";
import toast from "react-hot-toast";

interface DeliveryZone {
  name: string;
  landmarks: string[];
  fee: number;
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    restaurantName: "De Helen's Taste",
    email: "example@email.com",
    phone: "+64 958 248 966",
    address: "",
    currency: "NGN",
    taxRate: 0,
    enableNotifications: true,
    enableEmailAlerts: false,
    deliveryZones: [] as DeliveryZone[],
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        toast.success("Settings saved successfully!");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-center text-gray-500 text-sm">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-medium text-gray-800 mb-1">Settings</h1>
        <p className="text-sm text-gray-500">
          Manage your restaurant settings and preferences
        </p>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <FiGlobe className="text-lg text-[#228B22]" />
          <h2 className="text-base font-medium text-gray-800">
            General Settings
          </h2>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Restaurant Name
            </label>
            <input
              type="text"
              value={settings.restaurantName}
              onChange={(e) =>
                setSettings({ ...settings, restaurantName: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#228B22] focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) =>
                  setSettings({ ...settings, email: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#228B22] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) =>
                  setSettings({ ...settings, phone: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#228B22] focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Address
            </label>
            <textarea
              value={settings.address}
              onChange={(e) =>
                setSettings({ ...settings, address: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#228B22] focus:border-transparent"
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* Business Settings */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <FiDollarSign className="text-lg text-[#228B22]" />
          <h2 className="text-base font-medium text-gray-800">
            Business Settings
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Currency
            </label>
            <select
              value={settings.currency}
              onChange={(e) =>
                setSettings({ ...settings, currency: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#228B22] focus:border-transparent"
            >
              <option value="NGN">NGN (Naira)</option>
              <option value="USD">USD (Dollar)</option>
              <option value="GBP">GBP (Pound)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Tax Rate (%)
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={settings.taxRate === 0 ? "" : settings.taxRate}
              onChange={(e) => {
                const value = e.target.value;
                // Allow empty string, otherwise parse as number
                if (value === "") {
                  setSettings({ ...settings, taxRate: 0 });
                } else {
                  const numValue = parseFloat(value);
                  if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
                    setSettings({ ...settings, taxRate: numValue });
                  }
                }
              }}
              onBlur={(e) => {
                const value = e.target.value.trim();
                if (value === "") {
                  setSettings({ ...settings, taxRate: 0 });
                } else {
                  const numValue = parseFloat(value);
                  const clampedValue = Math.max(
                    0,
                    Math.min(100, isNaN(numValue) ? 0 : numValue)
                  );
                  setSettings({ ...settings, taxRate: clampedValue });
                }
              }}
              placeholder="0"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#228B22] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Delivery Zones Settings */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FiTruck className="text-lg text-[#228B22]" />
            <h2 className="text-base font-medium text-gray-800">
              Delivery Zones & Fees
            </h2>
          </div>
          <button
            onClick={() => {
              setSettings({
                ...settings,
                deliveryZones: [
                  ...settings.deliveryZones,
                  { name: "", landmarks: [], fee: 0 },
                ],
              });
            }}
            className="flex items-center gap-1 text-sm text-[#228B22] hover:text-[#1a6b1a] transition"
          >
            <FiPlus className="text-sm" />
            Add Zone
          </button>
        </div>
        <div className="space-y-4">
          {(settings.deliveryZones || []).map((zone, index) => (
            <div
              key={index}
              className="p-3 border border-gray-200 rounded-lg space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">
                  Zone {index + 1}
                </h3>
                <button
                  onClick={() => {
                    const updatedZones = settings.deliveryZones.filter(
                      (_, i) => i !== index
                    );
                    setSettings({ ...settings, deliveryZones: updatedZones });
                  }}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <FiX className="text-sm" />
                </button>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Zone Name
                </label>
                <input
                  type="text"
                  value={zone.name}
                  onChange={(e) => {
                    const updatedZones = [...settings.deliveryZones];
                    updatedZones[index].name = e.target.value;
                    setSettings({ ...settings, deliveryZones: updatedZones });
                  }}
                  placeholder="e.g., Zone 8, Phase II"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#228B22] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Landmarks (comma-separated)
                </label>
                <input
                  type="text"
                  value={zone.landmarks.join(", ")}
                  onChange={(e) => {
                    const updatedZones = [...settings.deliveryZones];
                    updatedZones[index].landmarks = e.target.value
                      .split(",")
                      .map((l) => l.trim())
                      .filter((l) => l.length > 0);
                    setSettings({ ...settings, deliveryZones: updatedZones });
                  }}
                  placeholder="e.g., Zone 8, Phase II, Phase 2"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#228B22] focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter landmarks separated by commas. During checkout,
                  customers will select one of these landmarks from a dropdown,
                  and the system will automatically apply this zone's delivery
                  fee. You can add multiple landmarks (e.g., "Zone 8, Phase II,
                  Phase 2") for the same zone - customers only need to match
                  one.
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Delivery Fee (₦)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={zone.fee || ""}
                  onChange={(e) => {
                    const updatedZones = [...settings.deliveryZones];
                    const value = e.target.value;
                    // Allow empty string, otherwise parse as number
                    if (value === "") {
                      updatedZones[index].fee = 0;
                    } else {
                      const numValue = parseFloat(value);
                      if (!isNaN(numValue) && numValue >= 0) {
                        updatedZones[index].fee = numValue;
                      }
                    }
                    setSettings({ ...settings, deliveryZones: updatedZones });
                  }}
                  onBlur={(e) => {
                    // Ensure it's always a valid number on blur
                    const updatedZones = [...settings.deliveryZones];
                    const value = e.target.value.trim();
                    if (value === "") {
                      updatedZones[index].fee = 0;
                    } else {
                      const numValue = parseFloat(value);
                      updatedZones[index].fee =
                        isNaN(numValue) || numValue < 0 ? 0 : numValue;
                    }
                    setSettings({ ...settings, deliveryZones: updatedZones });
                  }}
                  placeholder="0"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#228B22] focus:border-transparent"
                />
              </div>
            </div>
          ))}
          {settings.deliveryZones.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No delivery zones configured. Click "Add Zone" to add one.
            </p>
          )}
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <FiBell className="text-lg text-[#228B22]" />
          <h2 className="text-base font-medium text-gray-800">Notifications</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">
                Enable Notifications
              </p>
              <p className="text-xs text-gray-500">
                Receive notifications for new orders
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableNotifications}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    enableNotifications: e.target.checked,
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#228B22] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#228B22"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">Email Alerts</p>
              <p className="text-xs text-gray-500">
                Receive email notifications for important events
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableEmailAlerts}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    enableEmailAlerts: e.target.checked,
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#228B22] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#228B22"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#228B22] text-white px-4 py-2 rounded-lg hover:bg-[#1a6b1a] transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiSave className="text-sm" />
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
