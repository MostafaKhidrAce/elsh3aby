import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "عائلة الشعيبي بالأَحساء",
  description: "عائلة الشعيبي بالأَحساء",
  icons: {
    icon: [{ url: "/logos/mini-logo.svg", type: "image/svg+xml" }],
    apple: [{ url: "/logos/mini-logo.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
