"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Check if we're on the login or register page
  const isLoginPage = pathname === "/admin/login";
  const isRegisterPage = pathname === "/admin/register";
  const isAuthPage = isLoginPage || isRegisterPage;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Don't redirect if we're already on the login or register page
    if (mounted && !loading && !isAuthenticated && !isAuthPage) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, loading, router, isAuthPage, mounted]);

  // If on login or register page, always show children (don't check auth)
  if (isAuthPage) {
    return <>{children}</>;
  }

  // For other admin pages, check authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="lg:ml-64 transition-all duration-300 min-h-screen pt-16 lg:pt-0">
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
