"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "@/lib/admin-api";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const { data } = await adminApi.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", data.access_token);

      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/admin/products");
    } catch {
      setError("Credenciales incorrectas");
    }
  }

  return (
    <main className="max-w-md mx-auto mt-20">
      <h1 className="text-3xl font-bold mb-6">Login Admin</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-3 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-3 rounded"
        />

        <button className="w-full bg-black text-white p-3 rounded">
          Ingresar
        </button>

        {error && <p className="text-red-500">{error}</p>}
      </form>
    </main>
  );
}
