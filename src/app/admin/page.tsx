import { getSessionUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { redirect } from "next/navigation";
import { Header } from "@/components/Header";

export default async function AdminPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") redirect("/auth/login");

  const db = await getDB();

  return (
    <div className="min-h-screen bg-[#fbfbfd]">
      <Header user={{ id: user.id, name: user.name, role: user.role }} />
      <div className="pt-[80px] px-6">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="text-[28px] font-semibold">لوحة تحكم الأدمن</h1>

          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="glass-card rounded-[18px] p-5"><div className="text-[12px] text-black/50">المستخدمين</div><div className="text-[24px] font-semibold">{db.users.length}</div></div>
            <div className="glass-card rounded-[18px] p-5"><div className="text-[12px] text-black/50">مزودي الخدمة</div><div className="text-[24px] font-semibold">{db.providers.length}</div></div>
            <div className="glass-card rounded-[18px] p-5"><div className="text-[12px] text-black/50">الخدمات</div><div className="text-[24px] font-semibold">{db.services.length}</div></div>
            <div className="glass-card rounded-[18px] p-5 bg-black text-white"><div className="text-[12px] text-white/60">الحجوزات</div><div className="text-[24px] font-semibold">{db.bookings.length}</div></div>
          </div>

          <div className="mt-8 glass-card rounded-[20px] p-6">
            <h2 className="font-semibold mb-4">المستخدمين</h2>
            <div className="space-y-2">
              {db.users.map(u => (
                <div key={u.id} className="flex items-center justify-between p-3 rounded-xl bg-[#f5f5f7] text-[13px]">
                  <span className="font-medium">{u.name} - {u.email}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-white border">{u.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
