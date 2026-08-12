import { isLocale } from "@/lib/i18n/config";
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

  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-white">{children}</div>
  );
}
