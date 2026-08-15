import { EventDetailsPage } from "@/components/dashboard/events/EventDetailsPage";
import { getEventById } from "@/lib/dashboard/dummy-events";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function DashboardEventDetailsRoute({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: localeParam, id } = await params;
  if (!isLocale(localeParam)) notFound();
  const event = getEventById(id);
  if (!event) notFound();
  const dictionary = await getDictionary(localeParam);

  return (
    <EventDetailsPage
      locale={localeParam}
      dictionary={dictionary}
      event={event}
    />
  );
}
