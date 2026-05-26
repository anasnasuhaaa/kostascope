"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function LoginSuccessToast() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const isLoginSuccess = searchParams.get("login") === "success";

    if (!isLoginSuccess) {
      return;
    }

    toast.success("Login berhasil. Selamat datang di dashboard admin.");

    const params = new URLSearchParams(searchParams.toString());
    params.delete("login");

    const query = params.toString();

    router.replace(query ? `/admin?${query}` : "/admin", {
      scroll: false,
    });
  }, [router, searchParams]);

  return null;
}