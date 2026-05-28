"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, Save, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateMyPasswordAction, updateMyProfileAction } from "./actions";

type FieldErrors = Record<string, string[] | undefined>;

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors || errors.length === 0) {
    return null;
  }

  return <p className="text-xs font-medium text-red-600">{errors[0]}</p>;
}

function getInputClassName(hasError?: boolean) {
  return hasError ? "border-red-500 focus-visible:ring-red-200" : "";
}

export function ProfileNameForm({
  defaultName,
}: {
  defaultName: string | null;
}) {
  const [isPending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function handleSubmit(formData: FormData) {
    setFieldErrors({});

    startTransition(async () => {
      const result = await updateMyProfileAction(formData);

      if (!result.success) {
        setFieldErrors(result.fieldErrors ?? {});
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-lg font-bold">Edit Profil</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Perbarui nama yang ditampilkan pada akun admin.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Nama Admin <span className="text-red-500">*</span>
        </label>

        <Input
          id="name"
          name="name"
          defaultValue={defaultName ?? ""}
          placeholder="Masukkan nama admin"
          className={getInputClassName(Boolean(fieldErrors.name))}
        />

        <FieldError errors={fieldErrors.name} />
      </div>

      <Button type="submit" disabled={isPending} className="gap-2">
        <Save className="h-4 w-4" />
        {isPending ? "Menyimpan..." : "Simpan Profil"}
      </Button>
    </form>
  );
}

export function ProfilePasswordForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(formData: FormData) {
    setFieldErrors({});

    startTransition(async () => {
      const result = await updateMyPasswordAction(formData);

      if (!result.success) {
        setFieldErrors(result.fieldErrors ?? {});
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      formRef.current?.reset();
      setShowPassword(false);
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-lg font-bold">Ganti Password</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Gunakan password yang kuat untuk menjaga keamanan akun admin.
        </p>
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <label htmlFor="currentPassword" className="text-sm font-medium">
            Password Lama <span className="text-red-500">*</span>
          </label>

          <Input
            id="currentPassword"
            name="currentPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Masukkan password lama"
            className={getInputClassName(Boolean(fieldErrors.currentPassword))}
          />

          <FieldError errors={fieldErrors.currentPassword} />
        </div>

        <div className="space-y-2">
          <label htmlFor="newPassword" className="text-sm font-medium">
            Password Baru <span className="text-red-500">*</span>
          </label>

          <Input
            id="newPassword"
            name="newPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Minimal 8 karakter"
            className={getInputClassName(Boolean(fieldErrors.newPassword))}
          />

          <FieldError errors={fieldErrors.newPassword} />
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            Konfirmasi Password <span className="text-red-500">*</span>
          </label>

          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Ulangi password baru"
            className={getInputClassName(Boolean(fieldErrors.confirmPassword))}
          />

          <FieldError errors={fieldErrors.confirmPassword} />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => setShowPassword((value) => !value)}
          className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          {showPassword ? (
            <>
              <EyeOff className="h-4 w-4" />
              Sembunyikan password
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              Tampilkan password
            </>
          )}
        </button>

        <Button type="submit" disabled={isPending} className="gap-2">
          <ShieldCheck className="h-4 w-4" />
          {isPending ? "Menyimpan..." : "Simpan Password"}
        </Button>
      </div>
    </form>
  );
}