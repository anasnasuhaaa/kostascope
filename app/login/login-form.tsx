"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setError("");

    const result = await signIn("credentials", {
      email: String(formData.get("email")),
      password: String(formData.get("password")),
      redirect: false,
      callbackUrl: "/admin",
    });

    if (result?.error) {
      setError("Email atau password salah.");
      return;
    }

    window.location.href = result?.url ?? "/admin";
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <form
        action={handleSubmit}
        className="w-full max-w-sm space-y-5 rounded-xl border bg-background p-6 shadow-sm"
      >
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Login Admin</h1>
          <p className="text-sm text-muted-foreground">
            Masuk untuk mengelola data kost.
          </p>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
            placeholder="admin@kostapp.local"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
            placeholder="********"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
        >
          Masuk
        </button>
      </form>
    </main>
  );
}