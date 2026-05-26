"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";

function LoginIllustration() {
  return (
    <div className="relative hidden h-full overflow-hidden rounded-[2rem] bg-[#BE1E2D] p-8 text-white shadow-2xl shadow-red-950/20 lg:block">
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-black/20 blur-3xl" />

      <div className="relative z-10 flex h-full flex-col justify-between">
        <div>
          <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold backdrop-blur">
            Admin Area
          </div>

          <h1 className="mt-8 max-w-md text-4xl font-black leading-tight tracking-tight">
            Kelola Data Kost dengan Lebih Rapi.
          </h1>

          <p className="mt-5 max-w-md text-sm leading-7 text-white/75">
            Masuk untuk mengelola informasi kost, wilayah, fasilitas, harga,
            foto, dan status publikasi Kostascope.
          </p>
        </div>

        <div className="relative">
          <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-white/60">Dashboard Preview</p>
                <p className="font-bold">Kostascope Admin</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-white/20" />
            </div>

            <div className="grid gap-3">
              <div className="h-14 rounded-2xl bg-white/15" />
              <div className="grid grid-cols-3 gap-3">
                <div className="h-20 rounded-2xl bg-white/15" />
                <div className="h-20 rounded-2xl bg-white/15" />
                <div className="h-20 rounded-2xl bg-white/15" />
              </div>
              <div className="h-24 rounded-2xl bg-white/15" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginForm() {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError("");

    startTransition(async () => {
      const result = await signIn("credentials", {
        email: String(formData.get("email")),
        password: String(formData.get("password")),
        redirect: false,
      callbackUrl: "/admin?login=success",
      });

      if (result?.error) {
        setError("Email atau password salah.");
        return;
      }

     window.location.href = result?.url ?? "/admin?login=success";
    });
  }

  return (
    <main className="relative flex h-screen overflow-hidden bg-[#FAFAFC] text-zinc-950">
      <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#BE1E2D]/10 blur-3xl" />
      <div className="absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-[#BE1E2D]/10 blur-3xl" />

      <div className="relative z-10 mx-auto grid h-full w-full max-w-7xl items-center gap-8 px-4 py-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <section className="mx-auto flex w-full max-w-md flex-col justify-center">
          <div className="mb-6 text-center lg:text-left">
            <Link
              href="/"
              className="inline-flex text-2xl font-black tracking-tight text-[#BE1E2D]"
            >
              Kostascope
            </Link>

            <h1 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl">
              Login Admin
            </h1>

            <p className="mt-3 text-sm leading-6 text-zinc-500">
              Masuk untuk mengelola data Kostascope.
            </p>
          </div>

          <form
            action={handleSubmit}
            className="rounded-[1.75rem] border border-red-100 bg-white p-5 shadow-2xl shadow-red-950/10 sm:p-6"
          >
            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-bold">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="admin@kostapp.local"
                  className="h-12 w-full rounded-xl border border-red-100 bg-[#FAFAFC] px-4 text-sm outline-none transition focus:border-[#BE1E2D] focus:bg-white focus:ring-4 focus:ring-red-100"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-bold">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="Masukkan password"
                  className="h-12 w-full rounded-xl border border-red-100 bg-[#FAFAFC] px-4 text-sm outline-none transition focus:border-[#BE1E2D] focus:bg-white focus:ring-4 focus:ring-red-100"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="h-12 w-full rounded-xl bg-[#BE1E2D] text-sm font-black text-white shadow-lg shadow-red-950/15 transition hover:bg-[#9f1725] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isPending ? "Memproses..." : "Masuk"}
              </button>
            </div>

            <div className="mt-5 rounded-2xl bg-[#FFF7F8] px-4 py-3 text-center text-xs leading-5 text-zinc-500">
              Halaman ini hanya untuk pengelola Kostascope.
            </div>
          </form>

          <div className="mt-5 text-center text-xs text-zinc-400 lg:text-left">
            © 2026 Ormawa Eksekutif PKU IPB
          </div>
        </section>

        <LoginIllustration />
      </div>
    </main>
  );
}