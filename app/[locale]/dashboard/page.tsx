import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";

export default async function DashboardIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  redirect(`/${localeParam}/dashboard/events`);
}
