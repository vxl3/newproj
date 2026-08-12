import { getSessionUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { Header } from "@/components/Header";
import { redirect } from "next/navigation";
import ProviderDashClient from "./ProviderDashClient";

export default async function ProviderDashboard() {
  const user = await getSessionUser();
  if (!user) redirect("/auth/login");
  if (user.role !== "PROVIDER" && user.role !== "ADMIN") redirect("/dashboard");

  const db = await getDB();
  const myProviders = db.providers.filter(p => p.userId === user.id);
  const providerIds = myProviders.map(p => p.id);
  const bookings = db.bookings.filter(b => providerIds.includes(b.providerId)).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const services = db.services.filter(s => providerIds.includes(s.providerId));

  const enriched = bookings.map(b => {
    const service = db.services.find(s => s.id === b.serviceId);
    const customer = db.users.find(u => u.id === b.userId);
    const provider = db.providers.find(p => p.id === b.providerId);
    return { ...b, service, customer: customer ? { name: customer.name, email: customer.email } : null, provider };
  });

  const stats = {
    totalBookings: bookings.length,
    pending: bookings.filter(b => b.status === "PENDING").length,
    revenue: bookings.filter(b => b.status !== "CANCELLED").reduce((sum, b) => {
      const s = db.services.find(sv => sv.id === b.serviceId);
      return sum + (s?.price || 0);
    }, 0),
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd]">
      <Header user={{ id: user.id, name: user.name, role: user.role }} />
      <div className="pt-[80px] px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[28px] font-semibold tracking-[-0.02em]">لوحة تحكم المزود</h1>
              <p className="text-[14px] text-black/60">مرحباً {user.name} - لديك {myProviders.length} نشاط تجاري</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="glass-card rounded-[20px] p-5">
              <div className="text-[12px] text-black/50">إجمالي الحجوزات</div>
              <div className="text-[28px] font-semibold mt-1">{stats.totalBookings}</div>
            </div>
            <div className="glass-card rounded-[20px] p-5">
              <div className="text-[12px] text-black/50">بانتظار التأكيد</div>
              <div className="text-[28px] font-semibold mt-1 text-amber-600">{stats.pending}</div>
            </div>
            <div className="glass-card rounded-[20px] p-5 bg-black text-white">
              <div className="text-[12px] text-white/60">الإيرادات المتوقعة</div>
              <div className="text-[28px] font-semibold mt-1">{stats.revenue.toLocaleString()} د.ع</div>
            </div>
          </div>

          <div className="mt-8">
            <ProviderDashClient bookings={enriched} providers={myProviders} services={services} />
          </div>
        </div>
      </div>
    </div>
  );
}
