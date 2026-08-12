import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "احجزلي - منصة الحجوزات الأولى في الرمادي",
  description: "احجز صالون، عيادة، ملعب، جيم بثانية. منصة حجوزات عصرية لأهل الرمادي والأنبار",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
