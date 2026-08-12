import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";

/** Catch-all for non-public routes — RouteGuard shows the login modal. */
export default async function ProtectedCatchAllPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <div className="min-h-screen bg-white" aria-hidden />;
}
