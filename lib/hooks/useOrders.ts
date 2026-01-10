import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Order } from "@/lib/models";

const fetchOrders = async (): Promise<Order[]> => {
  const response = await fetch("/api/orders");
  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }
  const data = await response.json();
  return data;
};

const fetchOrder = async (id: string): Promise<Order> => {
  const response = await fetch(`/api/orders/${id}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Order not found");
    }
    throw new Error("Failed to fetch order");
  }
  const data = await response.json();
  return data;
};

const updateOrderStatus = async ({
  id,
  status,
}: {
  id: string;
  status: "pending" | "confirmed" | "completed" | "delivered" | "cancelled";
}): Promise<Order> => {
  const response = await fetch(`/api/orders/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update order status");
  }

  const data = await response.json();
  return data;
};

export const useOrders = () => {
  return useQuery<Order[], Error>({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    staleTime: 1000 * 30, // 30 seconds - orders update frequently
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useOrder = (id: string | undefined) => {
  return useQuery<Order, Error>({
    queryKey: ["order", id],
    queryFn: () => fetchOrder(id!),
    enabled: !!id,
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: (updatedOrder) => {
      // Invalidate and refetch orders list
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      // Update the specific order cache
      queryClient.setQueryData(["order", updatedOrder._id], updatedOrder);
      // Optimistically update the order in the orders list
      queryClient.setQueryData<Order[]>(["orders"], (old) => {
        if (!old) return old;
        return old.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        );
      });
    },
  });
};
