import { Suspense } from "react";
import { NewBookingForm } from "@/components/dashboard/booking/NewBookingForm";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function DashboardNewBookingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const dictionary = await getDictionary(localeParam);

  return (
    <Suspense fallback={null}>
      <NewBookingForm locale={localeParam} dictionary={dictionary} />
    </Suspense>
  );
}
