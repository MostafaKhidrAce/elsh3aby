import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function DashboardAddEventPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const dictionary = await getDictionary(localeParam);
  const t = dictionary.dashboard;

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 rounded-[20px] bg-white p-8 text-center shadow-[0_8px_30px_rgba(25,33,61,0.06)]">
      <h1 className="text-2xl font-bold text-[#170F49]">
        {t.eventsPage.addEvent}
      </h1>
      <p className="max-w-md text-sm text-[#6B7280] sm:text-base">
        {t.comingSoon}
      </p>
      <Link
        href={`/${localeParam}/dashboard/events`}
        className="rounded-[12px] bg-[#D5AF34] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-95"
      >
        {t.events}
      </Link>
    </div>
  );
}
