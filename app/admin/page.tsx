"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
   router.push("/admin/meals");
  }, [router]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <p className="text-center text-gray-600">Redirecting...</p>
    </div>
  );
}
