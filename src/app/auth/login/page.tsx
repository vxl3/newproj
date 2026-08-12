"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
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
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      
      <div className="w-full max-w-[420px] relative">
        <Link href="/" className="inline-flex items-center gap-2 text-[13px] font-medium mb-8 hover:opacity-70">
          <ArrowLeft className="w-4 h-4" /> العودة للرئيسية
        </Link>

        <div className="glass-strong rounded-[28px] p-2 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
          <div className="rounded-[20px] bg-white p-8">
            <div className="flex items-center gap-2.5 mb-8">
              <div className="w-9 h-9 rounded-[10px] bg-black text-white flex items-center justify-center font-semibold">ا</div>
              <span className="font-semibold text-[18px]">احجزلي</span>
            </div>

            <h1 className="text-[28px] font-semibold tracking-[-0.02em] leading-tight">أهلاً بعودتك</h1>
            <p className="text-[14px] text-black/60 mt-2">سجل دخولك للمتابعة إلى حجوزاتك</p>

            <div className="mt-6 p-3 rounded-xl bg-[#f5f5f7] text-[12px] leading-5">
              <div className="font-medium mb-1">حسابات تجريبية:</div>
              <div>زبون: ahmed@example.com / customer123</div>
              <div>مزود: barber@example.com / provider123</div>
              <div>أدمن: admin@ehjzly.com / admin123</div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-[13px] font-medium">البريد الإلكتروني</label>
                <input name="email" type="email" required defaultValue="ahmed@example.com" className="mt-1.5 w-full h-11 rounded-full bg-[#f5f5f7] px-4 text-[14px] outline-none focus:bg-white focus:ring-2 focus:ring-black/10 border border-transparent focus:border-black/10 transition-all" placeholder="you@example.com" />
              </div>
              <div>
                <label className="text-[13px] font-medium">كلمة المرور</label>
                <div className="relative mt-1.5">
                  <input name="password" type={show ? "text" : "password"} required defaultValue="customer123" className="w-full h-11 rounded-full bg-[#f5f5f7] px-4 pl-11 text-[14px] outline-none focus:bg-white focus:ring-2 focus:ring-black/10 border border-transparent focus:border-black/10 transition-all" placeholder="••••••••" />
                  <button type="button" onClick={() => setShow(!show)} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white flex items-center justify-center">
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {err && <div className="text-[13px] text-red-600 bg-red-50 p-3 rounded-xl">{err}</div>}

              <button disabled={loading} className="w-full h-11 rounded-full bg-black text-white text-[14px] font-medium disabled:opacity-50 hover:bg-black/90 transition-colors">
                {loading ? "جاري الدخول..." : "تسجيل دخول"}
              </button>

              <div className="text-center text-[13px] text-black/60 pt-2">
                ما عندك حساب؟ <Link href="/auth/register" className="text-black font-medium underline">أنشئ حساب جديد</Link>
              </div>
            </form>
          </div>
        </div>

        <p className="text-center text-[11px] text-black/30 mt-6">بتسجيل دخولك، أنت توافق على شروط الخدمة وسياسة الخصوصية</p>
      </div>
    </div>
  );
}
