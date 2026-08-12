"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const router = useRouter();
  const sp = useSearchParams();
  const defaultRole = sp.get("role") === "PROVIDER" ? "PROVIDER" : "CUSTOMER";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const fd = new FormData(e.currentTarget);
    const body = {
      name: fd.get("name"),
      email: fd.get("email"),
      password: fd.get("password"),
      role: fd.get("role"),
      phone: fd.get("phone"),
    };
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      setErr(data.error || "خطأ في التسجيل");
      setLoading(false);
      return;
    }
    router.push("/auth/login");
  }

  return (
    <motion.div
      className="glass-strong rounded-[28px] p-2 shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="rounded-[20px] bg-white p-8 relative overflow-hidden">
        {/* Decorative gradient */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-l from-emerald-500 via-teal-500 to-cyan-500" />
        
        <motion.h1 
          className="text-[28px] font-semibold tracking-[-0.02em]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          أنشئ حسابك
        </motion.h1>
        <motion.p 
          className="text-[14px] text-black/60 mt-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          ابدأ الحجز في أقل من دقيقة
        </motion.p>

        <motion.form 
          onSubmit={handleSubmit} 
          className="mt-6 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-medium">نوع الحساب</label>
              <select 
                name="role" 
                defaultValue={defaultRole} 
                className="mt-1.5 w-full h-11 rounded-full bg-[#f5f5f7] px-4 text-[13px] outline-none focus:ring-2 focus:ring-emerald-500/20 border border-transparent focus:border-emerald-500/30 transition-all cursor-pointer"
              >
                <option value="CUSTOMER">زبون - أريد الحجز</option>
                <option value="PROVIDER">مزود خدمة</option>
              </select>
            </div>
            <div>
              <label className="text-[12px] font-medium">رقم الهاتف</label>
              <input 
                name="phone" 
                type="tel" 
                placeholder="07xxxxxxxx" 
                className="mt-1.5 w-full h-11 rounded-full bg-[#f5f5f7] px-4 text-[14px] outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 border border-transparent focus:border-emerald-500/30 transition-all" 
              />
            </div>
          </div>

          <div>
            <label className="text-[12px] font-medium">الاسم الكامل</label>
            <input 
              name="name" 
              required 
              className="mt-1.5 w-full h-11 rounded-full bg-[#f5f5f7] px-4 text-[14px] outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 border border-transparent focus:border-emerald-500/30 transition-all" 
              placeholder="مثلاً: أحمد الراوي" 
            />
          </div>

          <div>
            <label className="text-[12px] font-medium">البريد الإلكتروني</label>
            <input 
              name="email" 
              type="email" 
              required 
              className="mt-1.5 w-full h-11 rounded-full bg-[#f5f5f7] px-4 text-[14px] outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 border border-transparent focus:border-emerald-500/30 transition-all" 
              placeholder="you@example.com" 
            />
          </div>

          <div>
            <label className="text-[12px] font-medium">كلمة المرور</label>
            <input 
              name="password" 
              type="password" 
              required 
              minLength={6} 
              className="mt-1.5 w-full h-11 rounded-full bg-[#f5f5f7] px-4 text-[14px] outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 border border-transparent focus:border-emerald-500/30 transition-all" 
              placeholder="على الأقل 6 أحرف" 
            />
          </div>

          {err && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[13px] text-red-600 bg-red-50 p-3 rounded-xl border border-red-100"
            >
              {err}
            </motion.div>
          )}

          <motion.button 
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full h-11 rounded-full bg-gradient-to-l from-emerald-600 to-teal-600 text-white text-[14px] font-medium disabled:opacity-50 hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="31.4 31.4" />
                </svg>
                جاري الإنشاء...
              </span>
            ) : "إنشاء حساب"}
          </motion.button>

          <div className="text-center text-[13px] text-black/60">
            عندك حساب؟ <Link href="/auth/login" className="text-emerald-600 font-medium hover:text-emerald-700 transition-colors">تسجيل دخول</Link>
          </div>
        </motion.form>
      </div>
    </motion.div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#fbfbfd] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="w-full max-w-[460px] relative">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link href="/" className="inline-flex items-center gap-2 text-[13px] font-medium mb-6 hover:opacity-70 transition-opacity">
            <ArrowLeft className="w-4 h-4" /> العودة
          </Link>
        </motion.div>

        <Suspense fallback={
          <div className="glass-strong rounded-[28px] p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        }>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
