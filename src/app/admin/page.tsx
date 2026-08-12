import { getSessionUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { Header } from "@/components/Header";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, Store, Calendar, Trash2, Shield, BarChart3, UserCheck, Clock } from "lucide-react";
import AdminClient from "./AdminClient";

export default async function AdminPage() {
  const user = await getSessionUser();
  
  // Redirect non-admins
  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  const db = await getDB();
  
  // Statistics
  const stats = {
    totalUsers: db.users.filter(u => u.role !== "ADMIN").length,
    totalProviders: db.users.filter(u => u.role === "PROVIDER").length,
    totalBookings: db.bookings.length,
    totalRevenue: db.bookings
      .filter(b => b.status === "COMPLETED")
      .reduce((sum, b) => {
        const service = db.services.find(s => s.id === b.serviceId);
        return sum + (service?.price || 0);
      }, 0),
  };

  // Recent users (last 10)
  const recentUsers = db.users
    .filter(u => u.role !== "ADMIN")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  // Recent bookings (last 10)
  const recentBookings = db.bookings
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)
    .map(b => ({
      ...b,
      user: db.users.find(u => u.id === b.userId),
      provider: db.providers.find(p => p.id === b.providerId),
      service: db.services.find(s => s.id === b.serviceId),
    }));

  return (
    <div className="min-h-screen bg-[#fbfbfd] relative overflow-hidden">
      {/* Background */}
      <div className="orb orb-1 opacity-30" />
      <div className="orb orb-2 opacity-20" />
      
      <Header user={{ id: user.id, name: user.name, role: user.role }} />
      
      <div className="pt-[80px] px-6 page-fade">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-[24px] font-semibold tracking-[-0.02em]">لوحة تحكم المدير</h1>
              <p className="text-[13px] text-black/50">مرحباً، {user.name}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "إجمالي المستخدمين", value: stats.totalUsers, icon: Users, color: "from-blue-500 to-cyan-500", bg: "bg-blue-50" },
              { label: "مزودي الخدمة", value: stats.totalProviders, icon: Store, color: "from-emerald-500 to-teal-500", bg: "bg-emerald-50" },
              { label: "إجمالي الحجوزات", value: stats.totalBookings, icon: Calendar, color: "from-violet-500 to-purple-500", bg: "bg-violet-50" },
              { label: "الإيرادات", value: stats.totalRevenue.toLocaleString() + " د.ع", icon: BarChart3, color: "from-amber-500 to-orange-500", bg: "bg-amber-50" },
            ].map((stat, i) => (
              <div key={i} className="glass-card rounded-[20px] p-5 card-hover">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[12px] text-black/50 mb-1">{stat.label}</p>
                    <p className="text-[24px] font-bold">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tables */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Users */}
            <div className="glass-card rounded-[24px] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-[16px] flex items-center gap-2">
                  <Users className="w-4 h-4 text-violet-600" />
                  آخر المستخدمين المسجلين
                </h2>
                <span className="text-[12px] px-2.5 py-1 rounded-full bg-violet-50 text-violet-600 font-medium">
                  {stats.totalUsers} مستخدم
                </span>
              </div>
              
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {recentUsers.length === 0 ? (
                  <div className="text-center py-8 text-black/40 text-[13px]">لا يوجد مستخدمين</div>
                ) : (
                  recentUsers.map(u => (
                    <div key={u.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-black/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white flex items-center justify-center text-[12px] font-medium">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-[13px] font-medium">{u.name}</p>
                          <p className="text-[11px] text-black/40">{u.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          u.role === 'PROVIDER' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {u.role === 'PROVIDER' ? 'مزود' : 'زبون'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Bookings */}
            <div className="glass-card rounded-[24px] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-[16px] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-violet-600" />
                  آخر الحجوزات
                </h2>
                <span className="text-[12px] px-2.5 py-1 rounded-full bg-violet-50 text-violet-600 font-medium">
                  {stats.totalBookings} حجز
                </span>
              </div>
              
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {recentBookings.length === 0 ? (
                  <div className="text-center py-8 text-black/40 text-[13px]">لا توجد حجوزات</div>
                ) : (
                  recentBookings.map(b => (
                    <div key={b.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-black/5 transition-colors">
                      <div>
                        <p className="text-[13px] font-medium">{b.provider?.businessName || 'غير معروف'}</p>
                        <p className="text-[11px] text-black/40">
                          {b.user?.name || 'غير معروف'} • {b.service?.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          b.status === 'COMPLETED' ? 'bg-blue-50 text-blue-600' :
                          b.status === 'CONFIRMED' ? 'bg-green-50 text-green-600' :
                          b.status === 'PENDING' ? 'bg-amber-50 text-amber-600' :
                          'bg-red-50 text-red-600'
                        }`}>
                          {b.status === 'COMPLETED' ? 'مكتمل' :
                           b.status === 'CONFIRMED' ? 'مؤكد' :
                           b.status === 'PENDING' ? 'قيد الانتظار' : 'ملغى'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Providers */}
          <div className="glass-card rounded-[24px] p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[16px] flex items-center gap-2">
                <Store className="w-4 h-4 text-emerald-600" />
                مزودي الخدمة
              </h2>
              <span className="text-[12px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 font-medium">
                {stats.totalProviders} مزود
              </span>
            </div>
            
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
              {db.providers.slice(0, 8).map(p => (
                <div key={p.id} className="p-3 rounded-xl border border-black/5 hover:bg-black/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium truncate">{p.businessName}</p>
                      <p className="text-[11px] text-black/40">{p.city}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <AdminClient db={db} />
        </div>
      </div>
    </div>
  );
}
