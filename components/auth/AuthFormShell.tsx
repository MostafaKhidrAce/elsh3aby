import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";

type AuthFormShellProps = {
  locale: Locale;
  title: string;
  subtitle: string;
  brandName: string;
  children: React.ReactNode;
};

export function AuthFormShell({
  locale,
  title,
  subtitle,
  brandName,
  children,
}: AuthFormShellProps) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
        <div className="mb-8 text-center">
          <Link
            href={`/${locale}/home`}
            className="text-2xl font-bold text-gold"
          >
            {brandName}
          </Link>
          <h1 className="mt-4 text-xl font-semibold text-foreground">{title}</h1>
          <p className="mt-2 text-sm text-muted">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
