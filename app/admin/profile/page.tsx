import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BadgeCheck,
  Building2,
  CalendarClock,
  Crown,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProfileNameForm, ProfilePasswordForm } from "./profile-forms";

export const dynamic = "force-dynamic";

function getRoleLabel(role?: string | null) {
  if (role === "SUPER_ADMIN") {
    return "Super Admin";
  }

  return "Admin";
}

function getRoleClassName(role?: string | null) {
  if (role === "SUPER_ADMIN") {
    return "bg-red-50 text-[#BE1E2D] ring-red-100";
  }

  return "bg-blue-50 text-blue-700 ring-blue-100";
}

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

function ProfileInfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border bg-muted/20 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#BE1E2D] ring-1 ring-red-100">
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="mt-1 truncate text-sm font-bold">{value}</p>
      </div>
    </div>
  );
}

export default async function AdminProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          createdKosts: true,
        },
      },
      createdKosts: {
        select: {
          id: true,
          name: true,
          status: true,
          createdAt: true,
          region: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border bg-linear-to-br from-zinc-950 via-zinc-900 to-[#4A0D16] p-6 text-white shadow-xl shadow-zinc-950/10 sm:p-8">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#BE1E2D]/30 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-white text-zinc-950 shadow-lg shadow-black/10">
              {user.role === "SUPER_ADMIN" ? (
                <Crown className="h-8 w-8 text-[#BE1E2D]" />
              ) : (
                <UserRound className="h-8 w-8 text-[#BE1E2D]" />
              )}
            </div>

            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-white ring-1 ring-white/15 backdrop-blur">
                <ShieldCheck className="h-4 w-4 text-red-200" />
                Admin Profile
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                {user.name ?? "Admin AngkasaKost"}
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
                Kelola informasi akun, pantau kontribusi data kost, dan perbarui
                keamanan password akun admin.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
            <p className="text-xs font-bold uppercase tracking-wider text-white/50">
              Total Kontribusi
            </p>
            <p className="mt-2 text-4xl font-black">
              {user._count.createdKosts}
            </p>
            <p className="mt-2 text-xs text-white/60">kost ditambahkan</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border bg-background p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold">Informasi Akun</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Detail akun admin yang sedang login.
                </p>
              </div>

              <span
                className={[
                  "inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1",
                  getRoleClassName(user.role),
                ].join(" ")}
              >
                {getRoleLabel(user.role)}
              </span>
            </div>

            <div className="mt-5 grid gap-3">
              <ProfileInfoItem
                icon={UserRound}
                label="Nama"
                value={user.name ?? "Belum diisi"}
              />

              <ProfileInfoItem icon={Mail} label="Email" value={user.email} />

              <ProfileInfoItem
                icon={BadgeCheck}
                label="Role"
                value={getRoleLabel(user.role)}
              />

              <ProfileInfoItem
                icon={CalendarClock}
                label="Terdaftar Sejak"
                value={formatDateTime(user.createdAt)}
              />

              <ProfileInfoItem
                icon={Building2}
                label="Jumlah Kost Ditambahkan"
                value={`${user._count.createdKosts} data kost`}
              />
            </div>
          </div>

          <div className="rounded-3xl border bg-background p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold">Kost Terbaru Saya</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Data kost terakhir yang kamu tambahkan.
                </p>
              </div>

              <Link
                href="/admin/kost"
                className="text-xs font-bold text-[#BE1E2D] hover:underline"
              >
                Lihat data
              </Link>
            </div>

            <div className="mt-5 divide-y rounded-2xl border">
              {user.createdKosts.map((kost) => (
                <Link
                  key={kost.id}
                  href={`/admin/kost/${kost.id}/edit`}
                  className="block p-4 transition hover:bg-muted/40"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">{kost.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {kost.region.name} • {formatDateTime(kost.createdAt)}
                      </p>
                    </div>

                    <span className="rounded-full bg-red-50 px-2 py-1 text-[10px] font-bold text-[#BE1E2D] ring-1 ring-red-100">
                      {kost.status}
                    </span>
                  </div>
                </Link>
              ))}

              {user.createdKosts.length === 0 && (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  Kamu belum menambahkan data kost.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border bg-background p-5 shadow-sm">
            <ProfileNameForm defaultName={user.name} />
          </div>

          <div className="rounded-3xl border bg-background p-5 shadow-sm">
            <ProfilePasswordForm />
          </div>
        </div>
      </section>
    </div>
  );
}