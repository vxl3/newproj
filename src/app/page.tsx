import { Header } from "@/components/Header";
import { ProviderCard } from "@/components/ProviderCard";
import { getDB } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import Link from "next/link";
import { Scissors, Stethoscope, Dumbbell, Trophy, Sparkles, Search, Calendar, Star, ArrowLeft, Clock3, ShieldCheck } from "lucide-react";

export default async function HomePage() {
  const db = await getDB();
  const user = await getSessionUser();
  const featured = db.providers.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#fbfbfd] relative overflow-hidden apple-gradient">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <Header user={user ? { id: user.id, name: user.name, role: user.role } : null} />

      {/* Hero */}
      <section className="relative pt-[120px] pb-16 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[12px] font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              200+ حجز اليوم في الرمادي
              <span className="px-1.5 py-0.5 rounded-full bg-black text-white text-[10px] ml-1">LIVE</span>
            </div>

            <h1 className="text-[44px] sm:text-[64px] font-semibold tracking-[-0.04em] leading-[0.9] text-[#1d1d1f]">
              احجز أي خدمة
              <br />
              <span className="bg-gradient-to-l from-[#0071e3] via-[#7a5af5] to-[#ff3b82] bg-clip-text text-transparent">بثانية واحدة.</span>
            </h1>

            <p className="text-[19px] leading-7 text-black/60 mt-6 max-w-[540px] tracking-[-0.01em]">
              منصة الحجوزات الأولى في الأنبار. صالونات، عيادات، ملاعب، جيم — كلشي صار أسهل.
            </p>

            <div className="flex flex-wrap gap-3 mt-8">
              <Link href="/providers" className="btn-apple h-11 px-7 inline-flex items-center gap-2 text-[15px] font-medium">
                <Search className="w-4 h-4" />
                استكشف الخدمات
              </Link>
              <Link href="/auth/register" className="btn-glass h-11 px-6 inline-flex items-center gap-2 text-[15px] font-medium">
                سجل كـ مزود خدمة
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex items-center gap-6 mt-10 text-[13px]">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-8 h-8 rounded-full border-2 border-white" alt="" />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 font-semibold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  4.9/5 من 1,200+ تقييم
                </div>
                <div className="text-black/50">يثق بنا أهل الرمادي</div>
              </div>
            </div>
          </div>

          {/* Floating Glass Search Card */}
          <div className="mt-16 lg:mt-0 lg:absolute lg:top-[140px] lg:left-6 lg:w-[380px]">
            <div className="glass-strong rounded-[28px] p-2 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
              <div className="rounded-[20px] bg-white p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-[16px]">حجز سريع</h3>
                  <span className="text-[12px] px-2.5 py-1 rounded-full bg-green-50 text-green-700 font-medium">متاح الآن</span>
                </div>

                <div className="space-y-3">
                  <div className="h-12 rounded-[12px] bg-[#f5f5f7] flex items-center px-4 gap-3 text-[14px] text-black/60">
                    <Search className="w-4 h-4" />
                    شنو تريد تحجز؟
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { icon: Scissors, label: "حلاقة", count: "12 متاح" },
                      { icon: Stethoscope, label: "عيادة", count: "8 متاح" },
                      { icon: Trophy, label: "ملعب", count: "5 متاح" },
                      { icon: Sparkles, label: "صالون", count: "15 متاح" },
                    ].map((item, i) => (
                      <Link key={i} href={`/providers?category=${["BARBER","CLINIC","FIELD","SALON"][i]}`} className="group rounded-[14px] border border-black/[0.06] p-3 hover:bg-black hover:text-white hover:border-black transition-all">
                        <item.icon className="w-5 h-5 mb-2" />
                        <div className="text-[13px] font-semibold">{item.label}</div>
                        <div className="text-[11px] opacity-60">{item.count}</div>
                      </Link>
                    ))}
                  </div>
                  <Link href="/providers" className="h-11 rounded-[12px] bg-black text-white flex items-center justify-center gap-2 text-[14px] font-medium hover:bg-black/90 transition-colors">
                    <Calendar className="w-4 h-4" />
                    عرض كل المواعيد
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="relative px-6 py-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-[28px] font-semibold tracking-[-0.02em]">تصفح حسب الخدمة</h2>
              <p className="text-[15px] text-black/60 mt-1">اختر التصنيف اللي يناسبك</p>
            </div>
            <Link href="/providers" className="hidden sm:flex items-center gap-1 text-[14px] font-medium hover:opacity-70">عرض الكل <ArrowLeft className="w-4 h-4" /></Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { id: "BARBER", label: "صالون حلاقة", icon: Scissors, grad: "from-amber-200 to-orange-300", count: 12 },
              { id: "CLINIC", label: "عيادات", icon: Stethoscope, grad: "from-blue-200 to-cyan-300", count: 8 },
              { id: "FIELD", label: "ملاعب", icon: Trophy, grad: "from-green-200 to-emerald-300", count: 5 },
              { id: "SALON", label: "تجميل نسائي", icon: Sparkles, grad: "from-pink-200 to-rose-300", count: 15 },
              { id: "GYM", label: "نوادي رياضية", icon: Dumbbell, grad: "from-purple-200 to-violet-300", count: 6 },
            ].map((c) => (
              <Link key={c.id} href={`/providers?category=${c.id}`} className="group glass-card rounded-[20px] p-5 hover:-translate-y-1 transition-all duration-300">
                <div className={`w-12 h-12 rounded-[14px] bg-gradient-to-br ${c.grad} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <c.icon className="w-6 h-6" />
                </div>
                <div className="font-semibold text-[14px]">{c.label}</div>
                <div className="text-[12px] text-black/50 mt-1">{c.count} مزود</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="relative px-6 py-14">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-baseline gap-3 mb-8">
            <h2 className="text-[28px] font-semibold tracking-[-0.02em]">الأكثر حجزاً هذا الأسبوع</h2>
            <span className="text-[13px] px-2.5 py-1 rounded-full bg-black text-white font-medium">🔥 ترند</span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featured.map(p => (
              <ProviderCard key={p.id} provider={p} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works - Apple style */}
      <section id="how" className="relative px-6 py-20">
        <div className="max-w-[1200px] mx-auto">
          <div className="glass-card rounded-[32px] p-8 md:p-12 overflow-hidden relative">
            <div className="grid md:grid-cols-3 gap-10 relative">
              {[
                { step: "01", title: "اختر الخدمة", desc: "تصفح مئات مقدمي الخدمات في الرمادي مع تقييمات حقيقية", icon: Search },
                { step: "02", title: "احجز موعدك", desc: "اختر اليوم والوقت المناسب وادفع عند الوصول أو اونلاين", icon: Calendar },
                { step: "03", title: "استمتع بالخدمة", desc: "روح في وقتك، بدون انتظار. تقييمك يهمنا", icon: Star },
              ].map((s, i) => (
                <div key={i} className="relative">
                  <div className="text-[56px] font-semibold tracking-[-0.05em] text-black/[0.06] leading-none mb-4">{s.step}</div>
                  <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center mb-4">
                    <s.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-[18px] tracking-[-0.01em]">{s.title}</h3>
                  <p className="text-[14px] text-black/60 leading-6 mt-2 max-w-[280px]">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 pt-8 border-t border-black/5">
              {[
                { label: "حجز فوري", value: "< 30 ثانية", icon: Clock3 },
                { label: "بدون عمولة", value: "0%", icon: ShieldCheck },
                { label: "دعم 24/7", value: "واتساب", icon: Star },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center">
                    <stat.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[12px] text-black/50">{stat.label}</div>
                    <div className="font-semibold text-[13px]">{stat.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-6 pb-20">
        <div className="max-w-[1200px] mx-auto">
          <div className="rounded-[32px] bg-black text-white p-8 md:p-14 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-violet-500/30 to-blue-500/30 blur-[80px] rounded-full" />
            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div>
                <h2 className="text-[32px] md:text-[40px] font-semibold tracking-[-0.03em] leading-[0.95]">عندك صالون، عيادة،<br />ملعب؟</h2>
                <p className="text-white/60 text-[15px] mt-4 max-w-[420px]">انضم لأكثر من 50 مزود خدمة في الرمادي وزيد حجوزاتك 300%. لوحة تحكم مجانية.</p>
              </div>
              <div className="flex gap-3">
                <Link href="/auth/register?role=PROVIDER" className="h-11 px-6 rounded-full bg-white text-black flex items-center gap-2 text-[14px] font-medium hover:bg-white/90 transition-colors">
                  سجل كمزود خدمة
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-black/5 py-10 px-6 text-center text-[12px] text-black/40">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <span>© 2026 احجزلي - منصة الحجوزات الذكية. صنع بـ ❤️ في الرمادي</span>
          <span className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> جميع الأنظمة تعمل بشكل طبيعي</span>
        </div>
      </footer>
    </div>
  );
}
