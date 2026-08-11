import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { AuthProvider } from "@/lib/auth/auth-context";
import { getDirection, isLocale, type Locale } from "@/lib/i18n/config";

const expoArabic = localFont({
  src: [
    {
      path: "../../public/fonts/expo-arabic/ExpoArabic-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/expo-arabic/ExpoArabic-Book.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/expo-arabic/ExpoArabic-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/expo-arabic/ExpoArabic-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/expo-arabic/ExpoArabic-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-expo-arabic",
  display: "swap",
});

export function generateStaticParams() {
  return [{ locale: "ar" }, { locale: "en" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale: Locale = localeParam;
  const dir = getDirection(locale);

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${expoArabic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
