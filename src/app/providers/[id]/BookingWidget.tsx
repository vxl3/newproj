"use client";
import { useState } from "react";
import { Provider, Service } from "@/lib/types";
import { Calendar, Clock, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BookingWidget({ provider, services, user }: { provider: Provider; services: Service[]; user: any }) {
  const [selectedService, setSelectedService] = useState<string>(services[0]?.id || "");
  const [date, setDate] = useState<string>(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [time, setTime] = useState("10:00");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const service = services.find(s => s.id === selectedService);

  async function handleBooking() {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    setLoading(true);
    setError("");
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ providerId: provider.id, serviceId: selectedService, date, startTime: time, notes: "" }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "فشل الحجز");
      setLoading(false);
      return;
    }
    setSuccess(true);
    setLoading(false);
    setTimeout(() => router.push("/dashboard"), 1500);
  }

  const times = ["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"];

  if (success) {
    return (
      <div className="glass-strong rounded-[24px] p-8 text-center shadow-xl">
        <div className="w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto mb-4">
          <Check className="w-7 h-7" />
        </div>
        <h3 className="font-semibold text-[18px]">تم الحجز بنجاح! 🎉</h3>
        <p className="text-[13px] text-black/60 mt-2">سيتم تأكيد حجزك قريباً. يمكنك متابعة حجوزاتك في لوحة التحكم.</p>
      </div>
    );
  }

  return (
    <div className="glass-strong rounded-[24px] p-2 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
      <div className="rounded-[18px] bg-white p-6">
        <h3 className="font-semibold text-[16px] flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          احجز الآن
        </h3>

        <div className="mt-5 space-y-4">
          <div>
            <label className="text-[12px] font-medium">اختر الخدمة</label>
            <select value={selectedService} onChange={e => setSelectedService(e.target.value)} className="mt-1.5 w-full h-11 rounded-full bg-[#f5f5f7] px-4 text-[13px] outline-none">
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.name} - {s.price.toLocaleString()} د.ع ({s.duration}د)</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-medium">التاريخ</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1.5 w-full h-11 rounded-full bg-[#f5f5f7] px-4 text-[13px] outline-none" />
            </div>
            <div>
              <label className="text-[12px] font-medium">الوقت</label>
              <select value={time} onChange={e => setTime(e.target.value)} className="mt-1.5 w-full h-11 rounded-full bg-[#f5f5f7] px-4 text-[13px] outline-none">
                {times.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {service && (
            <div className="rounded-[14px] bg-[#f5f5f7] p-3 flex items-center justify-between text-[13px]">
              <span className="text-black/60">المجموع</span>
              <span className="font-semibold">{service.price.toLocaleString()} د.ع · {service.duration} دقيقة</span>
            </div>
          )}

          {error && <div className="text-[12px] text-red-600 bg-red-50 p-2.5 rounded-xl">{error}</div>}

          <button onClick={handleBooking} disabled={loading || !selectedService} className="w-full h-11 rounded-full bg-black text-white text-[14px] font-medium hover:bg-black/90 disabled:opacity-50 flex items-center justify-center gap-2">
            <Clock className="w-4 h-4" />
            {loading ? "جاري الحجز..." : user ? `تأكيد الحجز - ${service?.price.toLocaleString()} د.ع` : "سجل دخول للحجز"}
          </button>

          <div className="text-[11px] text-black/40 text-center leading-4">
            حجز فوري ومجاني. إلغاء مجاني قبل 24 ساعة. دفع عند الوصول.
          </div>
        </div>
      </div>
    </div>
  );
}
