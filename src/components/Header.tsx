"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Calendar, User, Menu, X, LogOut, LayoutDashboard } from "lucide-react";

interface HeaderProps {
  user?: { id: string; name: string; role: string } | null;
}

export function Header({ user }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? "glass-strong shadow-[0_1px_0_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.04)]" : "bg-transparent"}`}>
      <div className="max-w-[1200px] mx-auto px-6 h-[52px] flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[8px] bg-black text-white flex items-center justify-center font-semibold text-[14px]">ا</div>
            <span className="font-semibold tracking-[-0.02em] text-[19px]">احجزلي</span>
            <span className="hidden sm:inline text-[11px] font-medium px-2 py-0.5 rounded-full bg-black/5 text-black/60 -ml-1">BETA</span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-[12px] font-medium text-black/70">
            <Link href="/providers" className="hover:text-black transition-colors">الخدمات</Link>
            <Link href="/#how" className="hover:text-black transition-colors">كيف يعمل</Link>
            <Link href="/#categories" className="hover:text-black transition-colors">التصنيفات</Link>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/providers" className="hidden md:flex btn-glass h-8 px-4 items-center gap-2 text-[13px] font-medium">
            <Search className="w-3.5 h-3.5" />
            بحث
          </Link>

          {user ? (
            <>
              <Link href={user.role === "PROVIDER" ? "/provider/dashboard" : user.role === "ADMIN" ? "/admin" : "/dashboard"} className="hidden md:flex items-center gap-2 h-8 px-3 rounded-full bg-black text-white text-[13px] font-medium">
                <LayoutDashboard className="w-4 h-4" />
                <span className="max-w-[100px] truncate">{user.name}</span>
              </Link>
              <form action="/api/auth/logout" method="POST" className="hidden md:block">
                <button className="w-8 h-8 rounded-full glass flex items-center justify-center hover:bg-white">
                  <LogOut className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="hidden md:flex h-8 px-4 rounded-full bg-black/5 hover:bg-black/10 items-center text-[13px] font-medium transition-colors">
                تسجيل دخول
              </Link>
              <Link href="/auth/register" className="hidden md:flex h-8 px-4 rounded-full bg-black text-white hover:bg-black/90 items-center text-[13px] font-medium transition-all">
                إنشاء حساب
              </Link>
            </>
          )}

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden w-8 h-8 rounded-full glass flex items-center justify-center">
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-[52px] inset-x-0 p-3">
          <div className="glass-strong rounded-[20px] p-3 shadow-xl">
            <div className="flex flex-col gap-1">
              <Link href="/providers" onClick={() => setMobileOpen(false)} className="h-11 px-4 rounded-xl hover:bg-black/5 flex items-center gap-3 text-[14px] font-medium">
                <Search className="w-4 h-4" /> تصفح الخدمات
              </Link>
              <Link href="/providers?category=BARBER" onClick={() => setMobileOpen(false)} className="h-11 px-4 rounded-xl hover:bg-black/5 flex items-center text-[14px]">صالون حلاقة</Link>
              <Link href="/providers?category=CLINIC" onClick={() => setMobileOpen(false)} className="h-11 px-4 rounded-xl hover:bg-black/5 flex items-center text-[14px]">عيادات</Link>
              <Link href="/providers?category=FIELD" onClick={() => setMobileOpen(false)} className="h-11 px-4 rounded-xl hover:bg-black/5 flex items-center text-[14px]">ملاعب</Link>
              <div className="h-[1px] bg-black/10 my-2" />
              {user ? (
                <>
                  <Link href={user.role === "PROVIDER" ? "/provider/dashboard" : "/dashboard"} onClick={() => setMobileOpen(false)} className="h-11 px-4 rounded-xl bg-black text-white flex items-center text-[14px]">لوحة التحكم</Link>
                </>
              ) : (
                <div className="flex gap-2 p-1">
                  <Link href="/auth/login" className="flex-1 h-11 rounded-full bg-black/5 flex items-center justify-center text-[14px] font-medium">دخول</Link>
                  <Link href="/auth/register" className="flex-1 h-11 rounded-full bg-black text-white flex items-center justify-center text-[14px] font-medium">حساب جديد</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
