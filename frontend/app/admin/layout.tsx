"use client";
import Sidebar from "@/components/admin/Sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    setAuthorized(true);
  }, [router]);
  if (!authorized) {
    return (
      <div className="flex items-center justify-center h-screen">
        Cargando...
      </div>
    );
  }
  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
