"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthFormShell } from "@/components/auth/AuthFormShell";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type ForgetPasswordFormProps = {
  dictionary: Dictionary;
  brandName: string;
};

export function ForgetPasswordForm({
  dictionary,
  brandName,
}: ForgetPasswordFormProps) {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as Locale;
  const t = dictionary.auth;
  const [emailOrPhone, setEmailOrPhone] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = encodeURIComponent(emailOrPhone);
    router.push(`/${locale}/forget-password/otp?target=${query}`);
  }

  return (
    <AuthFormShell
      locale={locale}
      title={t.forgetTitle}
      subtitle={t.forgetSubtitle}
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
        <button
          type="submit"
          className="rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          {t.sendCode}
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
