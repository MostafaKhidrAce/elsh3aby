import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale: Locale = localeParam;
  const dictionary = await getDictionary(locale);
  const t = dictionary.nav;

  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-white px-4 py-10 sm:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <h1
          className="text-[28px] font-bold sm:text-[36px]"
          style={{ color: "#170F49" }}
        >
          {t.dashboard}
        </h1>
        <p className="mt-3 text-[15px] text-[#170F49]/70 sm:text-[16px]">
          {locale === "ar"
            ? "هذه لوحة التحكم. سيتم ربطها لاحقاً بالخدمات الكاملة."
            : "This is the dashboard. Full services will be connected later."}
        </p>
      </div>
    </div>
  );
}
