import { getDB } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { Header } from "@/components/Header";
import { ProviderCard } from "@/components/ProviderCard";
import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";

export default async function ProvidersPage({ searchParams }: { searchParams: Promise<{ category?: string; search?: string; city?: string }> }) {
  const params = await searchParams;
  const db = await getDB();
  const user = await getSessionUser();

  let providers = db.providers;
  if (params.category) providers = providers.filter(p => p.category === params.category);
  if (params.search) {
    const q = params.search.toLowerCase();
    providers = providers.filter(p => p.businessName.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }

  const categories = [
    { id: "", label: "الكل" },
    { id: "BARBER", label: "حلاقة" },
    { id: "CLINIC", label: "عيادات" },
    { id: "FIELD", label: "ملاعب" },
    { id: "SALON", label: "تجميل" },
    { id: "GYM", label: "جيم" },
  ];

  return (
    <div className="min-h-screen bg-[#fbfbfd]">
      <Header user={user ? { id: user.id, name: user.name, role: user.role } : null} />
      
      <div className="pt-[80px] px-6">
        <div className="max-w-[1200px] mx-auto">
          {/* Search Bar - Apple style */}
          <div className="glass-strong rounded-[20px] p-2 flex items-center gap-2 max-w-[720px] mx-auto mt-6 shadow-sm">
            <div className="flex-1 h-11 rounded-full bg-[#f5f5f7] flex items-center px-4 gap-2.5">
              <Search className="w-4 h-4 text-black/40" />
              <form method="GET" className="flex-1">
                <input name="search" defaultValue={params.search} placeholder="ابحث عن صالون، عيادة، ملعب..." className="w-full bg-transparent outline-none text-[14px] placeholder:text-black/40" />
              </form>
            </div>
            <button className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(c => {
              const active = (params.category || "") === c.id;
              return (
                <Link key={c.id} href={`/providers${c.id ? `?category=${c.id}` : ""}`} className={`h-8 px-4 rounded-full text-[13px] font-medium whitespace-nowrap border transition-all ${active ? "bg-black text-white border-black" : "bg-white border-black/10 hover:border-black/20"}`}>
                  {c.label}
                </Link>
              );
            })}
          </div>

          <div className="mt-8 flex items-baseline justify-between">
            <h1 className="text-[22px] font-semibold tracking-[-0.01em]">{providers.length} خدمة متاحة</h1>
            <span className="text-[13px] text-black/50">في الرمادي والأنبار</span>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6 pb-20">
            {providers.map(p => (
              <ProviderCard key={p.id} provider={p} />
            ))}
          </div>

          {providers.length === 0 && (
            <div className="glass-card rounded-[24px] p-12 text-center mt-10">
              <div className="text-[15px] font-medium">لا توجد نتائج</div>
              <div className="text-[13px] text-black/50 mt-1">جرب بحث آخر أو تصنيف مختلف</div>
              <Link href="/providers" className="mt-4 inline-flex h-9 px-4 rounded-full bg-black text-white items-center text-[13px]">عرض الكل</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
