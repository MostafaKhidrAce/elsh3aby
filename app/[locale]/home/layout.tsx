import { PublicFooter } from "@/components/layout/PublicFooter";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { notFound } from "next/navigation";

export default async function HomeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale: Locale = localeParam;
  const dictionary = await getDictionary(locale);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-white">
      {children}
      <PublicFooter locale={locale} dictionary={dictionary} />
    </div>
  );
}
