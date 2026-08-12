"use client";
import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, X, Check, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardClient({ initialBookings }: { initialBookings: any[] }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    // Trigger animations when component mounts
    setBookings(initialBookings);
  }, [initialBookings]);

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
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-[24px] p-12 text-center page-fade"
      >
        <motion.div 
          className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center mx-auto mb-4"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Calendar className="w-7 h-7 text-violet-600" />
        </motion.div>
        <div className="font-medium text-[15px]">لا توجد حجوزات بعد</div>
        <div className="text-[13px] text-black/50 mt-1">ابدأ باكتشاف الخدمات واحجز موعدك الأول</div>
      </motion.div>
    );
  }

  const statusMap: any = {
    PENDING: { label: "قيد الانتظار", color: "bg-amber-100 text-amber-700 border-amber-200", icon: "⏳" },
    CONFIRMED: { label: "مؤكد", color: "bg-green-100 text-green-700 border-green-200", icon: "✅" },
    CANCELLED: { label: "ملغى", color: "bg-red-100 text-red-700 border-red-200", icon: "❌" },
    COMPLETED: { label: "مكتمل", color: "bg-blue-100 text-blue-700 border-blue-200", icon: "🎉" },
  };

  return (
    <motion.div 
      className="grid gap-3"
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.08 },
        },
      }}
    >
      <AnimatePresence>
        {bookings.map((b, index) => {
          const st = statusMap[b.status] || statusMap.PENDING;
          return (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="glass-card rounded-[18px] p-4 flex gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <motion.img 
                src={b.provider?.image} 
                alt="" 
                className="w-14 h-14 rounded-[14px] object-cover"
                whileHover={{ scale: 1.05 }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-[14px] truncate">{b.provider?.businessName}</h3>
                  <motion.span 
                    className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium border ${st.color}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    {st.label}
                  </motion.span>
                </div>
                <div className="text-[13px] text-black/60 mt-0.5">
                  {b.service?.name} · <span className="text-violet-600 font-medium">{b.service?.price?.toLocaleString()} د.ع</span>
                </div>
                <div className="flex items-center gap-3 mt-2 text-[12px] text-black/50">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {b.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {b.startTime} - {b.endTime}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                {b.status === "PENDING" && (
                  <motion.button 
                    disabled={!!loadingId} 
                    onClick={() => updateStatus(b.id, "CANCELLED")}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 rounded-full bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors"
                    title="إلغاء الحجز"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                )}
                {b.status === "CONFIRMED" && (
                  <motion.button 
                    disabled={!!loadingId} 
                    onClick={() => updateStatus(b.id, "COMPLETED")}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 rounded-full bg-green-50 text-green-600 hover:bg-green-100 flex items-center justify-center transition-colors"
                    title="تم الاستلام"
                  >
                    <Check className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}
