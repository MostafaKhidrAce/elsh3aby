import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale: Locale = localeParam;

  return (
    <div className="flex min-h-full flex-1 flex-col bg-gradient-to-b from-brand-soft/30 to-background">
      <div className="flex justify-end px-4 pt-4">
        <LanguageSwitcher locale={locale} />
      </div>
      {children}
    </div>
  );
}
