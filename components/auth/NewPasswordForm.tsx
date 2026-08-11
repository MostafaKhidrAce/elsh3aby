"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthFormShell } from "@/components/auth/AuthFormShell";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type NewPasswordFormProps = {
  dictionary: Dictionary;
  brandName: string;
};

export function NewPasswordForm({
  dictionary,
  brandName,
}: NewPasswordFormProps) {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as Locale;
  const t = dictionary.auth;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError(dictionary.common.required);
      return;
    }
    setError("");
    router.push(`/${locale}/login`);
  }

  return (
    <AuthFormShell
      locale={locale}
      title={t.newPasswordTitle}
      subtitle={t.newPasswordSubtitle}
      brandName={brandName}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">{t.password}</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-brand"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">{t.confirmPassword}</span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-brand"
          />
        </label>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          className="rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          {t.savePassword}
        </button>
        <p className="text-center text-sm text-muted">
          <Link href={`/${locale}/login`} className="font-medium text-brand hover:underline">
            {t.backToLogin}
          </Link>
        </p>
      </form>
    </AuthFormShell>
  );
}
