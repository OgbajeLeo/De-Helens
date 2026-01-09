import { useQuery } from "@tanstack/react-query";
import { MenuItem } from "@/lib/models";

const fetchMenuItems = async (): Promise<MenuItem[]> => {
  const response = await fetch("/api/menu");
  if (!response.ok) {
    throw new Error("Failed to fetch menu items");
  }
  const data = await response.json();
  return data;
};

export const useMenuItems = () => {
  return useQuery<MenuItem[], Error>({
    queryKey: ["menuItems"],
    queryFn: fetchMenuItems,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};
