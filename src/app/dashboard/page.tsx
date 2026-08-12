import { getSessionUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { Header } from "@/components/Header";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, MapPin, X, Check, Star, Sparkles } from "lucide-react";
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
    <div className="min-h-screen bg-[#fbfbfd] relative overflow-hidden">
      {/* Background orbs */}
      <div className="orb orb-1 opacity-50" />
      <div className="orb orb-3 opacity-30" />
      
      <Header user={{ id: user.id, name: user.name, role: user.role }} />
      <div className="pt-[80px] px-6 page-fade">
        <div className="max-w-[1000px] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-[28px] font-semibold tracking-[-0.02em] flex items-center gap-2">
                مرحباً، {user.name} 
                <span className="text-xl">👋</span>
              </h1>
              <p className="text-[14px] text-black/60 mt-1">
                لديك <span className="text-violet-600 font-semibold">{enriched.length}</span> حجز
              </p>
            </div>
            <Link 
              href="/providers" 
              className="h-9 px-5 rounded-full bg-gradient-to-l from-violet-600 to-purple-600 text-white flex items-center text-[13px] font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              حجز جديد
            </Link>
          </div>

          <div className="mt-8">
            <DashboardClient initialBookings={enriched} />
          </div>
        </div>
      </div>
    </div>
  );
}
