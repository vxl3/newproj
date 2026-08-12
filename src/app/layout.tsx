import type { Metadata } from "next";
import "./globals.css";
import { PageTransition } from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "احجزلي - منصة الحجوزات الأولى في الرمادي",
  description: "احجز صالون، عيادة، ملعب، جيم بثانية. منصة حجوزات عصرية لأهل الرمادي والأنبار",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen antialiased">
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
