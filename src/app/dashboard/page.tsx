import { getSessionUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { Header } from "@/components/Header";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, MapPin, X, Check, Star } from "lucide-react";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/auth/login");

  const db = await getDB();
  let bookings = db.bookings.filter(b => b.userId === user.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const enriched = bookings.map(b => {
    const provider = db.providers.find(p => p.id === b.providerId);
    const service = db.services.find(s => s.id === b.serviceId);
    return { ...b, provider, service };
  });

  return (
    <div className="min-h-screen bg-[#fbfbfd]">
      <Header user={{ id: user.id, name: user.name, role: user.role }} />
      <div className="pt-[80px] px-6">
        <div className="max-w-[1000px] mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[28px] font-semibold tracking-[-0.02em}">مرحباً، {user.name} 👋</h1>
              <p className="text-[14px] text-black/60 mt-1">لديك {enriched.length} حجز</p>
            </div>
            <Link href="/providers" className="h-9 px-4 rounded-full bg-black text-white flex items-center text-[13px] font-medium">حجز جديد</Link>
          </div>

          <div className="mt-8">
            <DashboardClient initialBookings={enriched} />
          </div>
        </div>
      </div>
    </div>
  );
}
