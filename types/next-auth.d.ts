import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: "ADMIN" | "SUPER_ADMIN";
    };
  }

  interface User {
    id: string;
    role: "ADMIN" | "SUPER_ADMIN";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "ADMIN" | "SUPER_ADMIN";
  }
}