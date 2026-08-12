"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: fd.get("email"), password: fd.get("password") }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (!res.ok) {
      setErr(data.error || "خطأ في تسجيل الدخول");
      setLoading(false);
      return;
    }
    router.push(data.user.role === "PROVIDER" ? "/provider/dashboard" : data.user.role === "ADMIN" ? "/admin" : "/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#fbfbfd] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      
      <motion.div 
        className="w-full max-w-[420px] relative"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Link href="/" className="inline-flex items-center gap-2 text-[13px] font-medium mb-8 hover:opacity-70 transition-opacity">
            <ArrowLeft className="w-4 h-4" /> العودة للرئيسية
          </Link>
        </motion.div>

        <motion.div 
          className="glass-strong rounded-[28px] p-2 shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="rounded-[20px] bg-white p-8 relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-l from-violet-500 via-purple-500 to-pink-500" />
            
            <motion.div 
              className="flex items-center gap-2.5 mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-violet-500 to-purple-600 text-white flex items-center justify-center font-semibold shadow-lg">
                ا
              </div>
              <span className="font-semibold text-[18px]">احجزلي</span>
            </motion.div>

            <motion.h1 
              className="text-[28px] font-semibold tracking-[-0.02em] leading-tight"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              أهلاً بعودتك
            </motion.h1>
            <motion.p 
              className="text-[14px] text-black/60 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              سجل دخولك للمتابعة إلى حجوزاتك
            </motion.p>

            <motion.form 
              onSubmit={handleSubmit} 
              className="mt-6 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <div>
                <label className="text-[13px] font-medium">البريد الإلكتروني</label>
                <input 
                  name="email" 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 w-full h-11 rounded-full bg-[#f5f5f7] px-4 text-[14px] outline-none focus:bg-white focus:ring-2 focus:ring-violet-500/20 border border-transparent focus:border-violet-500/30 transition-all input-glow" 
                  placeholder="you@example.com" 
                />
              </div>
              <div>
                <label className="text-[13px] font-medium">كلمة المرور</label>
                <div className="relative mt-1.5">
                  <input 
                    name="password" 
                    type={show ? "text" : "password"} 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 rounded-full bg-[#f5f5f7] px-4 pl-11 text-[14px] outline-none focus:bg-white focus:ring-2 focus:ring-violet-500/20 border border-transparent focus:border-violet-500/30 transition-all input-glow" 
                    placeholder="••••••••" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShow(!show)} 
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
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
                className="w-full h-11 rounded-full bg-gradient-to-l from-violet-600 to-purple-600 text-white text-[14px] font-medium disabled:opacity-50 hover:shadow-lg hover:shadow-violet-500/25 transition-all"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="31.4 31.4" />
                    </svg>
                    جاري الدخول...
                  </span>
                ) : "تسجيل دخول"}
              </motion.button>

              <div className="text-center text-[13px] text-black/60 pt-2">
                ما عندك حساب؟ <Link href="/auth/register" className="text-violet-600 font-medium hover:text-violet-700 transition-colors">أنشئ حساب جديد</Link>
              </div>
            </motion.form>
          </div>
        </motion.div>

        <motion.p 
          className="text-center text-[11px] text-black/30 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          بتسجيل دخولك، أنت توافق على شروط الخدمة وسياسة الخصوصية
        </motion.p>
      </motion.div>
    </div>
  );
}
