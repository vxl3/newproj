"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

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
    <div className="glass-strong rounded-[28px] p-2 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
      <div className="rounded-[20px] bg-white p-8">
        <h1 className="text-[28px] font-semibold tracking-[-0.02em]">أنشئ حسابك</h1>
        <p className="text-[14px] text-black/60 mt-1.5">ابدأ الحجز في أقل من دقيقة</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-medium">نوع الحساب</label>
              <select name="role" defaultValue={defaultRole} className="mt-1.5 w-full h-11 rounded-full bg-[#f5f5f7] px-4 text-[13px] outline-none">
                <option value="CUSTOMER">زبون - أريد الحجز</option>
                <option value="PROVIDER">مزود خدمة</option>
              </select>
            </div>
            <div>
              <label className="text-[12px] font-medium">رقم الهاتف</label>
              <input name="phone" type="tel" placeholder="07xxxxxxxx" className="mt-1.5 w-full h-11 rounded-full bg-[#f5f5f7] px-4 text-[14px] outline-none focus:bg-white focus:ring-2 focus:ring-black/10" />
            </div>
          </div>

          <div>
            <label className="text-[12px] font-medium">الاسم الكامل</label>
            <input name="name" required className="mt-1.5 w-full h-11 rounded-full bg-[#f5f5f7] px-4 text-[14px] outline-none" placeholder="مثلاً: أحمد الراوي" />
          </div>

          <div>
            <label className="text-[12px] font-medium">البريد الإلكتروني</label>
            <input name="email" type="email" required className="mt-1.5 w-full h-11 rounded-full bg-[#f5f5f7] px-4 text-[14px] outline-none" placeholder="you@example.com" />
          </div>

          <div>
            <label className="text-[12px] font-medium">كلمة المرور</label>
            <input name="password" type="password" required minLength={6} className="mt-1.5 w-full h-11 rounded-full bg-[#f5f5f7] px-4 text-[14px] outline-none" placeholder="على الأقل 6 أحرف" />
          </div>

          {err && <div className="text-[13px] text-red-600 bg-red-50 p-3 rounded-xl">{err}</div>}

          <button disabled={loading} className="w-full h-11 rounded-full bg-black text-white text-[14px] font-medium disabled:opacity-50">
            {loading ? "جاري الإنشاء..." : "إنشاء حساب"}
          </button>

          <div className="text-center text-[13px] text-black/60">
            عندك حساب؟ <Link href="/auth/login" className="text-black font-medium underline">تسجيل دخول</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#fbfbfd] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="w-full max-w-[460px] relative">
        <Link href="/" className="inline-flex items-center gap-2 text-[13px] font-medium mb-6 hover:opacity-70">
          <ArrowLeft className="w-4 h-4" /> العودة
        </Link>

        <Suspense fallback={<div className="glass-strong rounded-[28px] p-8">جاري التحميل...</div>}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
