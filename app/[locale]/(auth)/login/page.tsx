import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const dictionary = await getDictionary(localeParam);

  return (
    <Suspense fallback={null}>
      <LoginForm dictionary={dictionary} />
    </Suspense>
  );
}
