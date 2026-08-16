import { ConsultRequestDetailsPage } from "@/components/dashboard/requests/ConsultRequestDetailsPage";
import { HelpRequestDetailsPage } from "@/components/dashboard/requests/HelpRequestDetailsPage";
import { getRequestById } from "@/lib/dashboard/dummy-requests";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function DashboardRequestDetailsRoute({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: localeParam, id } = await params;
  if (!isLocale(localeParam)) notFound();

  const item = getRequestById(id);
  if (!item || (item.category !== "help" && item.category !== "consult")) {
    notFound();
  }

  const dictionary = await getDictionary(localeParam);

  if (item.category === "consult") {
    return (
      <ConsultRequestDetailsPage
        locale={localeParam}
        dictionary={dictionary}
        item={item}
      />
    );
  }

  return (
    <HelpRequestDetailsPage
      locale={localeParam}
      dictionary={dictionary}
      item={item}
    />
  );
}
