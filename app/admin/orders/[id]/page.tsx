"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import toast from "react-hot-toast";
import { useOrder, useUpdateOrderStatus } from "@/lib/hooks/useOrders";
import ConfirmationModal from "@/components/ConfirmationModal";

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const { data: order, isLoading: loading, error } = useOrder(orderId);
  const updateStatusMutation = useUpdateOrderStatus();
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    newStatus:
      | "pending"
      | "confirmed"
      | "completed"
      | "delivered"
      | "cancelled"
      | null;
  }>({
    isOpen: false,
    newStatus: null,
  });

  // Redirect if order not found
  useEffect(() => {
    if (error && !loading) {
      toast.error(error instanceof Error ? error.message : "Order not found");
      router.push("/admin/orders");
    }
  }, [error, loading, router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  };

  const handleStatusUpdate = (
    newStatus: "pending" | "confirmed" | "completed" | "delivered" | "cancelled"
  ) => {
    if (!orderId || !order) return;
    setConfirmModal({
      isOpen: true,
      newStatus,
    });
  };

  const handleConfirmStatusUpdate = async () => {
    if (!confirmModal.newStatus || !orderId) return;

    try {
      await updateStatusMutation.mutateAsync({
        id: orderId,
        status: confirmModal.newStatus,
      });
      toast.success(`Order status updated to ${confirmModal.newStatus}`);
      setConfirmModal({ isOpen: false, newStatus: null });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update order status"
      );
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getConfirmButtonColor = (
    status: string
  ): "primary" | "danger" | "success" => {
    if (status === "cancelled") return "danger";
    if (status === "completed" || status === "delivered") return "success";
    return "primary";
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-center items-center py-12">
          <p className="text-gray-500 text-sm">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="text-center py-12">
          <p className="text-gray-500 text-sm">Order not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <button
        onClick={() => router.push("/admin/orders")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition mb-4 text-sm font-medium"
      >
        <FiArrowLeft className="text-sm" />
        Back to Orders
      </button>

      <div className="mb-6">
        <h2 className="text-xl font-medium text-gray-800 mb-2">
          Order Details
        </h2>
        <p className="text-sm text-gray-500">Order ID: {order._id}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Customer Information */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase">
            Customer Information
          </h3>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-gray-500">Name</p>
              <p className="text-sm font-medium text-gray-800">
                {order.customerName}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Phone</p>
              <p className="text-sm font-medium text-gray-800">
                {order.customerPhone}
              </p>
            </div>
          </div>
        </div>

        {/* Order Information */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase">
            Order Information
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 mb-2">Status</p>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                    order.status || "pending"
                  )}`}
                >
                  {order.status || "pending"}
                </span>
              </div>
              <select
                value={order.status || "pending"}
                onChange={(e) =>
                  handleStatusUpdate(
                    e.target.value as
                      | "pending"
                      | "confirmed"
                      | "completed"
                      | "delivered"
                      | "cancelled"
                  )
                }
                disabled={updateStatusMutation.isPending}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#228B22] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed bg-white"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              {updateStatusMutation.isPending && (
                <p className="text-xs text-gray-500 mt-1">Updating...</p>
              )}
            </div>
            <div>
              <p className="text-xs text-gray-500">Delivery Type</p>
              <p className="text-sm font-medium text-gray-800">
                {order.deliveryType === "delivery" ? "Delivery" : "Shop Pickup"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Created At</p>
              <p className="text-sm font-medium text-gray-800">
                {formatDate(order.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Information */}
      {order.deliveryType === "delivery" &&
        (order.deliveryAddress || order.landmark || order.deliveryFee) && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase">
              Delivery Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {order.deliveryAddress && (
                <div>
                  <p className="text-xs text-gray-500">Delivery Address</p>
                  <p className="text-sm font-medium text-gray-800 mt-1">
                    {order.deliveryAddress}
                  </p>
                </div>
              )}
              {order.landmark && (
                <div>
                  <p className="text-xs text-gray-500">Closest Landmark</p>
                  <p className="text-sm font-medium text-gray-800 mt-1">
                    {order.landmark}
                  </p>
                </div>
              )}
              {order.deliveryFee !== undefined &&
                order.deliveryFee !== null && (
                  <div>
                    <p className="text-xs text-gray-500">Delivery Fee</p>
                    <p className="text-sm font-medium text-[#228B22] mt-1">
                      ₦{order.deliveryFee.toLocaleString()}
                    </p>
                  </div>
                )}
            </div>
          </div>
        )}

      {/* Order Items */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase">
          Order Items ({order.items?.length || 0})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Item Name
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Quantity
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Unit Price
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {item.name}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {item.quantity}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    ₦{item.price?.toLocaleString() || "0"}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-800">
                    ₦
                    {(
                      (item.price || 0) * (item.quantity || 0)
                    ).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-gray-200">
                <td
                  colSpan={3}
                  className="py-2 px-4 text-sm text-gray-600 text-right"
                >
                  Subtotal:
                </td>
                <td className="py-2 px-4 text-sm font-medium text-gray-700">
                  ₦
                  {order.subtotal?.toLocaleString() ||
                    order.total?.toLocaleString() ||
                    "0"}
                </td>
              </tr>
              {order.deliveryType === "delivery" &&
                order.deliveryFee !== undefined &&
                order.deliveryFee !== null &&
                order.deliveryFee > 0 && (
                  <tr className="border-t border-gray-200">
                    <td
                      colSpan={3}
                      className="py-2 px-4 text-sm text-gray-600 text-right"
                    >
                      Delivery Fee:
                    </td>
                    <td className="py-2 px-4 text-sm font-medium text-gray-700">
                      ₦{order.deliveryFee.toLocaleString()}
                    </td>
                  </tr>
                )}
              <tr className="border-t-2 border-gray-300">
                <td
                  colSpan={3}
                  className="py-3 px-4 text-sm font-semibold text-gray-700 text-right"
                >
                  Total:
                </td>
                <td className="py-3 px-4 text-lg font-bold text-[#228B22]">
                  ₦{order.total?.toLocaleString() || "0"}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, newStatus: null })}
        onConfirm={handleConfirmStatusUpdate}
        title="Update Order Status"
        message={
          confirmModal.newStatus
            ? `Are you sure you want to change the order status to "${getStatusLabel(
                confirmModal.newStatus
              )}"?`
            : "Are you sure you want to update this order status?"
        }
        confirmText={
          confirmModal.newStatus
            ? `Update to ${getStatusLabel(confirmModal.newStatus)}`
            : "Confirm"
        }
        cancelText="Cancel"
        confirmButtonColor={
          confirmModal.newStatus
            ? getConfirmButtonColor(confirmModal.newStatus)
            : "primary"
        }
        isLoading={updateStatusMutation.isPending}
      />
    </div>
  );
}
