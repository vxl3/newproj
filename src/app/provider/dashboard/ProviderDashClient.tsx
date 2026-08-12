"use client";
import { useState } from "react";
import { Calendar, Check, X, Clock, Wallet } from "lucide-react";

export default function ProviderDashClient({ bookings: initial, providers, services }: { bookings: any[]; providers: any[]; services: any[] }) {
  const [bookings, setBookings] = useState(initial);
  const [tab, setTab] = useState<"bookings" | "services">("bookings");

  async function update(id: string, status: string) {
    const res = await fetch("/api/bookings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    if (res.ok) {
      const upd = await res.json();
      setBookings(b => b.map(x => x.id === id ? { ...x, status: upd.status } : x));
    }
  }

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab("bookings")} className={`h-9 px-4 rounded-full text-[13px] font-medium ${tab === "bookings" ? "bg-black text-white" : "bg-white border border-black/10"}`}>الحجوزات ({bookings.length})</button>
        <button onClick={() => setTab("services")} className={`h-9 px-4 rounded-full text-[13px] font-medium ${tab === "services" ? "bg-black text-white" : "bg-white border border-black/10"}`}>خدماتي ({services.length})</button>
      </div>

      {tab === "bookings" && (
        <div className="space-y-3">
          {bookings.map(b => (
            <div key={b.id} className="glass-card rounded-[18px] p-4 flex gap-4 items-center">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-[13px]">{b.customer?.name?.[0]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[14px]">{b.customer?.name}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-black/5">{b.provider?.businessName}</span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full ${b.status === "PENDING" ? "bg-amber-100 text-amber-700" : b.status === "CONFIRMED" ? "bg-green-100 text-green-700" : b.status === "CANCELLED" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>{b.status}</span>
                </div>
                <div className="text-[13px] text-black/60 mt-0.5">{b.service?.name} · {b.date} {b.startTime}</div>
              </div>
              <div className="flex gap-1.5">
                {b.status === "PENDING" && (
                  <>
                    <button onClick={() => update(b.id, "CONFIRMED")} className="h-8 px-3 rounded-full bg-green-600 text-white text-[12px] flex items-center gap-1"><Check className="w-3 h-3" />تأكيد</button>
                    <button onClick={() => update(b.id, "CANCELLED")} className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center"><X className="w-4 h-4" /></button>
                  </>
                )}
                {b.status === "CONFIRMED" && (
                  <button onClick={() => update(b.id, "COMPLETED")} className="h-8 px-3 rounded-full bg-black text-white text-[12px]">مكتمل</button>
                )}
              </div>
            </div>
          ))}
          {bookings.length === 0 && <div className="glass-card rounded-[20px] p-10 text-center text-[13px] text-black/50">لا توجد حجوزات بعد</div>}
        </div>
      )}

      {tab === "services" && (
        <div className="grid md:grid-cols-3 gap-4">
          {services.map((s: any) => (
            <div key={s.id} className="glass-card rounded-[18px] p-4">
              <img src={s.image} alt="" className="w-full h-32 rounded-[12px] object-cover mb-3" />
              <h3 className="font-medium text-[14px]">{s.name}</h3>
              <p className="text-[12px] text-black/60 mt-1 line-clamp-2">{s.description}</p>
              <div className="flex items-center justify-between mt-3 text-[12px]">
                <span className="flex items-center gap-1"><Wallet className="w-3 h-3" />{s.price.toLocaleString()} د.ع</span>
                <span className="px-2 py-0.5 rounded-full bg-black/5">{s.duration} د</span>
              </div>
            </div>
          ))}
          {providers.length > 0 && (
            <div className="glass-card rounded-[18px] p-6 border-dashed border-2 flex flex-col items-center justify-center text-center min-h-[200px]">
              <div className="text-[13px] font-medium">إضافة خدمة جديدة</div>
              <div className="text-[12px] text-black/50 mt-1">قريباً: يمكنك إضافة خدمات من هنا</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
