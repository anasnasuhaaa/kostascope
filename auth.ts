import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

type AdminRole = "ADMIN" | "SUPER_ADMIN";

/**
 * ============================================================
 * PENGATURAN DURASI SESI LOGIN
 * ============================================================
 *
 * Nilai menggunakan satuan DETIK.
 *
 * Konfigurasi aktif saat ini:
 * - Admin akan logout setelah sesi berlaku selama 2 jam.
 *
 * Beberapa pilihan durasi:
 *
 * 1 menit untuk testing:
 * const SESSION_MAX_AGE = 60;
 *
 * 30 menit:
 * const SESSION_MAX_AGE = 30 * 60;
 *
 * 2 jam:
 * const SESSION_MAX_AGE = 2 * 60 * 60;
 *
 * 1 hari:
 * const SESSION_MAX_AGE = 24 * 60 * 60;
 *
 * 2 hari:
 * const SESSION_MAX_AGE = 2 * 24 * 60 * 60;
 *
 * 7 hari:
 * const SESSION_MAX_AGE = 7 * 24 * 60 * 60;
 */
const SESSION_MAX_AGE = 24 * 60 * 60; // 1 hari

/**
 * Memastikan role yang masuk hanya ADMIN atau SUPER_ADMIN.
 * Apabila role tidak dikenali, gunakan ADMIN sebagai fallback.
 */
function normalizeRole(role: unknown): AdminRole {
  if (role === "SUPER_ADMIN") {
    return "SUPER_ADMIN";
  }

  return "ADMIN";
}

/**
 * Validasi data login sebelum query dijalankan ke database.
 */
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const authOptions: NextAuthOptions = {
  /**
   * ============================================================
   * KONFIGURASI SESI
   * ============================================================
   *
   * strategy: "jwt"
   * - Data sesi disimpan menggunakan JWT.
   *
   * maxAge
   * - Menentukan masa berlaku sesi dalam satuan detik.
   * - Nilainya menggunakan konstanta SESSION_MAX_AGE di atas.
   */
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE,
  },

  /**
   * ============================================================
   * KONFIGURASI JWT
   * ============================================================
   *
   * JWT digunakan karena session.strategy menggunakan "jwt".
   * maxAge disamakan dengan session.maxAge agar durasinya konsisten.
   */
  jwt: {
    maxAge: SESSION_MAX_AGE,
  },

  /**
   * Arahkan pengguna ke halaman login buatan sendiri
   * ketika autentikasi dibutuhkan.
   */
  pages: {
    signIn: "/login",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      /**
       * Memeriksa email dan password ketika pengguna login.
       */
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: parsed.data.email,
          },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash,
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: normalizeRole(user.role),
        };
      },
    }),
  ],

  callbacks: {
    /**
     * Callback ini dijalankan ketika JWT dibuat atau dibaca.
     *
     * Saat login berhasil, simpan id dan role user ke dalam token.
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = normalizeRole(user.role);
      }

      return token;
    },

    /**
     * Callback ini menentukan data yang diteruskan
     * dari JWT ke session.user.
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? token.sub ?? "");
        session.user.role = normalizeRole(token.role);
      }

      return session;
    },
  },
};

/**
 * Helper untuk mengambil session dari Server Component,
 * Server Action, atau route handler.
 */
export function auth() {
  return getServerSession(authOptions);
}