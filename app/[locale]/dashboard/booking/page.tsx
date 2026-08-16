import { BookingPage } from "@/components/dashboard/booking/BookingPage";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function DashboardBookingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const dictionary = await getDictionary(localeParam);

  return <BookingPage locale={localeParam} dictionary={dictionary} />;
}
