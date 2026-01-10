import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MenuItem } from "@/lib/models";
import toast from "react-hot-toast";

const fetchMenuItems = async (): Promise<MenuItem[]> => {
  const response = await fetch("/api/menu");
  if (!response.ok) {
    throw new Error("Failed to fetch menu items");
  }
  const data = await response.json();
  return data.map((item: any) => ({
    ...item,
    _id: item._id || item.id || "",
  }));
};

const createMenuItem = async (formData: {
  name: string;
  description: string;
  price: string;
  category: "shawama" | "drinks" | "food" | "protein";
  image: string;
  available: boolean;
}): Promise<MenuItem> => {
  const response = await fetch("/api/menu", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create item");
  }

  const data = await response.json();
  return {
    ...data,
    _id: data._id || data.id || "",
  };
};

const deleteMenuItem = async (id: string): Promise<void> => {
  const response = await fetch(`/api/menu/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete item");
  }
};

const uploadImage = async (file: File): Promise<string> => {
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

  if (!data.url) {
    throw new Error("No URL returned from server");
  }

  // Cloudinary returns a full URL (https://res.cloudinary.com/...)
  // So we can return it directly
  return data.url;
};

export const useAdminMenuItems = () => {
  return useQuery<MenuItem[], Error>({
    queryKey: ["menuItems", "admin"],
    queryFn: fetchMenuItems,
    staleTime: 1000 * 60 * 2, // 2 minutes - admin may need fresher data
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMenuItem,
    onSuccess: (newItem) => {
      // Optimistically update the cache
      queryClient.setQueryData<MenuItem[]>(["menuItems", "admin"], (old) => {
        return old ? [...old, newItem] : [newItem];
      });
      // Also invalidate the public menu items query
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
      toast.success(
        "Menu item created successfully! It will appear on your website."
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create item");
    },
  });
};

export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMenuItem,
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["menuItems", "admin"] });

      // Snapshot the previous value
      const previousItems = queryClient.getQueryData<MenuItem[]>([
        "menuItems",
        "admin",
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData<MenuItem[]>(["menuItems", "admin"], (old) => {
        return old ? old.filter((item) => item._id !== id) : [];
      });

      return { previousItems };
    },
    onSuccess: () => {
      // Invalidate both admin and public queries
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
      toast.success("Menu item deleted successfully!");
    },
    onError: (error: Error, _id, context) => {
      // Rollback on error
      if (context?.previousItems) {
        queryClient.setQueryData(
          ["menuItems", "admin"],
          context.previousItems
        );
      }
      toast.error(error.message || "Failed to delete item");
    },
  });
};

export const useUploadImage = () => {
  return useMutation({
    mutationFn: uploadImage,
    onError: (error: Error) => {
      toast.error(error.message || "Failed to upload image. Please try again.");
    },
  });
};
