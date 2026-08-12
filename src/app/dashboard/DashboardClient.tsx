"use client";
import { useState } from "react";
import { Calendar, Clock, MapPin, X, Check } from "lucide-react";

export default function DashboardClient({ initialBookings }: { initialBookings: any[] }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function updateStatus(id: string, status: string) {
    setLoadingId(id);
    const res = await fetch("/api/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      const updated = await res.json();
      setBookings(b => b.map(x => x.id === id ? { ...x, status: updated.status } : x));
    }
    setLoadingId(null);
  }

  if (bookings.length === 0) {
    return (
      <div className="glass-card rounded-[24px] p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-[#f5f5f7] flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-7 h-7 text-black/40" />
        </div>
        <div className="font-medium text-[15px]">لا توجد حجوزات بعد</div>
        <div className="text-[13px] text-black/50 mt-1">ابدأ باكتشاف الخدمات واحجز موعدك الأول</div>
      </div>
    );
  }

  const statusMap: any = {
    PENDING: { label: "قيد الانتظار", color: "bg-amber-100 text-amber-700" },
    CONFIRMED: { label: "مؤكد", color: "bg-green-100 text-green-700" },
    CANCELLED: { label: "ملغى", color: "bg-red-100 text-red-700" },
    COMPLETED: { label: "مكتمل", color: "bg-blue-100 text-blue-700" },
  };

  return (
    <div className="grid gap-3">
      {bookings.map(b => {
        const st = statusMap[b.status] || statusMap.PENDING;
        return (
          <div key={b.id} className="glass-card rounded-[18px] p-4 flex gap-4">
            <img src={b.provider?.image} alt="" className="w-14 h-14 rounded-[14px] object-cover" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-[14px] truncate">{b.provider?.businessName}</h3>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${st.color}`}>{st.label}</span>
              </div>
              <div className="text-[13px] text-black/60 mt-0.5">{b.service?.name} · {b.service?.price?.toLocaleString()} د.ع</div>
              <div className="flex items-center gap-3 mt-2 text-[12px] text-black/50">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{b.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{b.startTime} - {b.endTime}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              {b.status === "PENDING" && (
                <button disabled={!!loadingId} onClick={() => updateStatus(b.id, "CANCELLED")} className="w-8 h-8 rounded-full bg-black/5 hover:bg-red-50 hover:text-red-600 flex items-center justify-center">
                  <X className="w-4 h-4" />
                </button>
              )}
              {b.status === "CONFIRMED" && (
                <button disabled={!!loadingId} onClick={() => updateStatus(b.id, "COMPLETED")} className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
