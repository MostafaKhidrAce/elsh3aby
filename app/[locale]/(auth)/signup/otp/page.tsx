import { OtpForm } from "@/components/auth/OtpForm";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function SignupOtpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const dictionary = await getDictionary(localeParam);

  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-muted">
          {dictionary.common.loading}
        </div>
      }
    >
      <OtpForm dictionary={dictionary} purpose="signup" />
    </Suspense>
  );
}
