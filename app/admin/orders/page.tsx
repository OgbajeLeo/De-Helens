"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowRight } from "react-icons/fi";
import { useOrders, useUpdateOrderStatus } from "@/lib/hooks/useOrders";
import toast from "react-hot-toast";
import ConfirmationModal from "@/components/ConfirmationModal";

export default function OrdersPage() {
  const router = useRouter();
  const { data: orders = [], isLoading: loading, error } = useOrders();
  const updateStatusMutation = useUpdateOrderStatus();
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    orderId: string | null;
    newStatus: "confirmed" | "completed" | "delivered" | "cancelled" | null;
  }>({
    isOpen: false,
    orderId: null,
    newStatus: null,
  });

  const handleOrderClick = (orderId: string | undefined) => {
    if (orderId) {
      router.push(`/admin/orders/${orderId}`);
    }
  };

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

  const handleQuickStatusUpdate = (
    orderId: string,
    newStatus: "confirmed" | "completed" | "delivered" | "cancelled",
    e: React.MouseEvent
  ) => {
    e.stopPropagation(); // Prevent row click
    setConfirmModal({
      isOpen: true,
      orderId,
      newStatus,
    });
  };

  const handleConfirmStatusUpdate = async () => {
    if (!confirmModal.orderId || !confirmModal.newStatus) return;

    try {
      await updateStatusMutation.mutateAsync({
        id: confirmModal.orderId,
        status: confirmModal.newStatus,
      });
      toast.success(`Order marked as ${confirmModal.newStatus}`);
      setConfirmModal({ isOpen: false, orderId: null, newStatus: null });
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

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-center items-center py-12">
          <p className="text-gray-500 text-sm">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="text-center py-12">
          <p className="text-red-600 text-sm">
            {error instanceof Error ? error.message : "Failed to load orders"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="mb-4">
          <h2 className="text-xl font-medium text-gray-800">Orders</h2>
          <p className="text-sm text-gray-500 mt-1">
            View and manage customer orders
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                    Customer Name
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                    Phone
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                    Items
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                    Total
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                    Created At
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                    Quick Actions
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                    View
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => handleOrderClick(order._id)}
                  >
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {order.customerName}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {order.customerPhone}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {order.items?.length || 0} item(s)
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-[#228B22]">
                      ₦{order.total?.toLocaleString() || "0"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                          order.status || "pending"
                        )}`}
                      >
                        {order.status || "pending"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <div
                        className="flex flex-wrap gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {order.status === "pending" && (
                          <>
                            <button
                              onClick={(e) =>
                                handleQuickStatusUpdate(
                                  order._id!,
                                  "confirmed",
                                  e
                                )
                              }
                              disabled={updateStatusMutation.isPending}
                              className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Mark as Confirmed"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={(e) =>
                                handleQuickStatusUpdate(
                                  order._id!,
                                  "cancelled",
                                  e
                                )
                              }
                              disabled={updateStatusMutation.isPending}
                              className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Cancel Order"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {order.status === "confirmed" && (
                          <>
                            <button
                              onClick={(e) =>
                                handleQuickStatusUpdate(
                                  order._id!,
                                  "completed",
                                  e
                                )
                              }
                              disabled={updateStatusMutation.isPending}
                              className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Mark as Completed"
                            >
                              Complete
                            </button>
                          </>
                        )}
                        {order.status === "completed" && (
                          <button
                            onClick={(e) =>
                              handleQuickStatusUpdate(
                                order._id!,
                                "delivered",
                                e
                              )
                            }
                            disabled={updateStatusMutation.isPending}
                            className="px-2 py-1 text-xs bg-emerald-500 text-white rounded hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Mark as Delivered"
                          >
                            Deliver
                          </button>
                        )}
                        {order.status !== "pending" &&
                          order.status !== "confirmed" &&
                          order.status !== "completed" &&
                          order.status !== "delivered" &&
                          order.status !== "cancelled" && (
                            <button
                              onClick={(e) =>
                                handleQuickStatusUpdate(
                                  order._id!,
                                  "confirmed",
                                  e
                                )
                              }
                              disabled={updateStatusMutation.isPending}
                              className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Mark as Confirmed"
                            >
                              Confirm
                            </button>
                          )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOrderClick(order._id);
                        }}
                        className="flex items-center gap-1 text-[#228B22] hover:text-[#1a6b1a] transition text-sm font-medium"
                      >
                        View
                        <FiArrowRight className="text-xs" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() =>
          setConfirmModal({ isOpen: false, orderId: null, newStatus: null })
        }
        onConfirm={handleConfirmStatusUpdate}
        title="Update Order Status"
        message={
          confirmModal.newStatus
            ? `Are you sure you want to mark this order as "${getStatusLabel(
                confirmModal.newStatus
              )}"?`
            : "Are you sure you want to update this order status?"
        }
        confirmText={
          confirmModal.newStatus
            ? `Mark as ${getStatusLabel(confirmModal.newStatus)}`
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
    </>
  );
}
