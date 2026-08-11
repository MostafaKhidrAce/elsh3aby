"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthFormShell } from "@/components/auth/AuthFormShell";
import { useAuth } from "@/lib/auth/auth-context";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type LoginFormProps = {
  dictionary: Dictionary;
  brandName: string;
};

export function LoginForm({ dictionary, brandName }: LoginFormProps) {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as Locale;
  const { login } = useAuth();
  const t = dictionary.auth;
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    login({
      name: emailOrPhone.split("@")[0] || emailOrPhone,
      emailOrPhone,
    });
    router.push(`/${locale}/home`);
  }

  return (
    <AuthFormShell
      locale={locale}
      title={t.loginTitle}
      subtitle={t.loginSubtitle}
      brandName={brandName}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">{t.emailOrPhone}</span>
          <input
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            required
            className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-brand"
          />
        </label>
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
        <div className="text-end">
          <Link
            href={`/${locale}/forget-password`}
            className="text-sm text-brand hover:underline"
          >
            {t.forgotPassword}
          </Link>
        </div>
        <button
          type="submit"
          className="rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          {t.login}
        </button>
        <p className="text-center text-sm text-muted">
          {t.noAccount}{" "}
          <Link href={`/${locale}/signup`} className="font-medium text-brand hover:underline">
            {t.signup}
          </Link>
        </p>
      </form>
    </AuthFormShell>
  );
}
