"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthFormShell } from "@/components/auth/AuthFormShell";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type OtpFormProps = {
  dictionary: Dictionary;
};

export function OtpForm({ dictionary }: OtpFormProps) {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = params.locale as Locale;
  const target = searchParams.get("target") ?? "";
  const t = dictionary.auth;
  const [otp, setOtp] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = target ? `?target=${encodeURIComponent(target)}` : "";
    router.push(`/${locale}/forget-password/new-password${query}`);
  }

  return (
    <AuthFormShell
      locale={locale}
      title={t.otpTitle}
      subtitle={t.otpSubtitle}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">{t.otp}</span>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            pattern="\d{4,6}"
            minLength={4}
            maxLength={6}
            required
            className="rounded-lg border border-border bg-background px-3 py-2 tracking-[0.3em] outline-none focus:border-brand"
          />
        </label>
        <button
          type="submit"
          className="rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          {t.verify}
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
