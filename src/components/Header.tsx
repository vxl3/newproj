"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, []);

  return (
    <motion.header 
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? "glass-strong shadow-[0_1px_0_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.04)]" : "bg-transparent"}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-[52px] flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div 
              className="w-7 h-7 rounded-[8px] bg-gradient-to-br from-violet-500 to-purple-600 text-white flex items-center justify-center font-semibold text-[14px] shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              ا
            </motion.div>
            <span className="font-semibold tracking-[-0.02em] text-[19px]">احجزلي</span>
            <span className="hidden sm:inline text-[11px] font-medium px-2 py-0.5 rounded-full bg-gradient-to-r from-violet-100 to-purple-100 text-violet-600 -ml-1">BETA</span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-[12px] font-medium text-black/70">
            {[
              { href: "/providers", label: "الخدمات" },
              { href: "/#how", label: "كيف يعمل" },
              { href: "/#categories", label: "التصنيفات" },
            ].map((item) => (
              <Link 
                key={item.href} 
                href={item.href} 
                className="hover:text-violet-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-violet-600 hover:after:w-full after:transition-all"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <Link 
            href="/providers" 
            className="hidden md:flex btn-glass h-8 px-4 items-center gap-2 text-[13px] font-medium group"
          >
            <Search className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            بحث
          </Link>

          {user ? (
            <>
              <Link 
                href={user.role === "PROVIDER" ? "/provider/dashboard" : user.role === "ADMIN" ? "/admin" : "/dashboard"} 
                className="hidden md:flex items-center gap-2 h-8 px-3 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white text-[13px] font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="max-w-[100px] truncate">{user.name}</span>
              </Link>
              <form action="/api/auth/logout" method="POST" className="hidden md:block">
                <motion.button 
                  className="w-8 h-8 rounded-full glass flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <LogOut className="w-4 h-4" />
                </motion.button>
              </form>
            </>
          ) : (
            <>
              <Link 
                href="/auth/login" 
                className="hidden md:flex h-8 px-4 rounded-full bg-black/5 hover:bg-black/10 items-center text-[13px] font-medium transition-colors"
              >
                تسجيل دخول
              </Link>
              <Link 
                href="/auth/register" 
                className="hidden md:flex h-8 px-4 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:shadow-lg hover:shadow-violet-500/25 items-center text-[13px] font-medium transition-all"
              >
                إنشاء حساب
              </Link>
            </>
          )}

          <motion.button 
            onClick={() => setMobileOpen(!mobileOpen)} 
            className="md:hidden w-8 h-8 rounded-full glass flex items-center justify-center"
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.div key="x" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
                  <X className="w-4 h-4" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }}>
                  <Menu className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            className="md:hidden absolute top-[52px] inset-x-0 p-3 menu-animate"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="glass-strong rounded-[20px] p-3 shadow-xl">
              <div className="flex flex-col gap-1">
                <Link 
                  href="/providers" 
                  onClick={() => setMobileOpen(false)} 
                  className="h-11 px-4 rounded-xl hover:bg-violet-50 flex items-center gap-3 text-[14px] font-medium transition-colors"
                >
                  <Search className="w-4 h-4" /> تصفح الخدمات
                </Link>
                <Link 
                  href="/providers?category=BARBER" 
                  onClick={() => setMobileOpen(false)} 
                  className="h-11 px-4 rounded-xl hover:bg-violet-50 flex items-center text-[14px] transition-colors"
                >
                  صالون حلاقة
                </Link>
                <Link 
                  href="/providers?category=CLINIC" 
                  onClick={() => setMobileOpen(false)} 
                  className="h-11 px-4 rounded-xl hover:bg-violet-50 flex items-center text-[14px] transition-colors"
                >
                  عيادات
                </Link>
                <Link 
                  href="/providers?category=FIELD" 
                  onClick={() => setMobileOpen(false)} 
                  className="h-11 px-4 rounded-xl hover:bg-violet-50 flex items-center text-[14px] transition-colors"
                >
                  ملاعب
                </Link>
                <div className="h-[1px] bg-black/10 my-2" />
                {user ? (
                  <>
                    <Link 
                      href={user.role === "PROVIDER" ? "/provider/dashboard" : "/dashboard"} 
                      onClick={() => setMobileOpen(false)} 
                      className="h-11 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white flex items-center text-[14px]"
                    >
                      لوحة التحكم
                    </Link>
                  </>
                ) : (
                  <div className="flex gap-2 p-1">
                    <Link 
                      href="/auth/login" 
                      className="flex-1 h-11 rounded-full bg-black/5 flex items-center justify-center text-[14px] font-medium"
                    >
                      دخول
                    </Link>
                    <Link 
                      href="/auth/register" 
                      className="flex-1 h-11 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white flex items-center justify-center text-[14px] font-medium"
                    >
                      حساب جديد
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
