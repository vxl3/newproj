import { getDB } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { Header } from "@/components/Header";
import { ProviderCard } from "@/components/ProviderCard";
import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import ProvidersClient from "./ProvidersClient";

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
      
      <div className="pt-[80px] px-6 page-fade">
        <div className="max-w-[1200px] mx-auto">
          {/* Search Bar - Enhanced */}
          <div className="glass-strong rounded-[20px] p-2 flex items-center gap-2 max-w-[720px] mx-auto mt-6 shadow-lg card-hover">
            <div className="flex-1 h-11 rounded-full bg-[#f5f5f7] flex items-center px-4 gap-2.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-violet-500/20 transition-all">
              <Search className="w-4 h-4 text-black/40" />
              <form method="GET" className="flex-1">
                <input 
                  name="search" 
                  defaultValue={params.search} 
                  placeholder="ابحث عن صالون، عيادة، ملعب..." 
                  className="w-full bg-transparent outline-none text-[14px] placeholder:text-black/40" 
                />
              </form>
            </div>
            <button className="w-11 h-11 rounded-full bg-gradient-to-l from-violet-600 to-purple-600 text-white flex items-center justify-center hover:shadow-lg hover:shadow-violet-500/25 transition-all">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((c, index) => {
              const active = (params.category || "") === c.id;
              return (
                <Link 
                  key={c.id} 
                  href={`/providers${c.id ? `?category=${c.id}` : ""}`} 
                  className={`
                    h-8 px-4 rounded-full text-[13px] font-medium whitespace-nowrap border transition-all duration-300
                    ${active 
                      ? "bg-gradient-to-l from-violet-600 to-purple-600 text-white border-transparent shadow-lg shadow-violet-500/25" 
                      : "bg-white border-black/10 hover:border-violet-300 hover:bg-violet-50"
                    }
                  `}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {c.label}
                </Link>
              );
            })}
          </div>

          {/* Results Header */}
          <div className="mt-8 flex items-baseline justify-between page-fade">
            <h1 className="text-[22px] font-semibold tracking-[-0.01em]">
              <span className="text-violet-600 font-bold">{providers.length}</span> خدمة متاحة
            </h1>
            <span className="text-[13px] text-black/50">في الرمادي والأنبار</span>
          </div>

          {/* Provider Grid */}
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6 pb-20">
            {providers.map((p, index) => (
              <div 
                key={p.id} 
                className="card-entrance"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <ProviderCard provider={p} />
              </div>
            ))}
          </div>

          {/* Empty State */}
          {providers.length === 0 && (
            <div className="glass-card rounded-[24px] p-12 text-center mt-10 page-fade">
              <div className="text-[48px] mb-4">🔍</div>
              <div className="text-[15px] font-medium">لا توجد نتائج</div>
              <div className="text-[13px] text-black/50 mt-1">جرب بحث آخر أو تصنيف مختلف</div>
              <Link href="/providers" className="mt-4 inline-flex h-9 px-4 rounded-full bg-gradient-to-l from-violet-600 to-purple-600 text-white items-center text-[13px] font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all">
                عرض الكل
              </Link>
            </div>
          )}
        </div>
      </div>
      
      <ProvidersClient />
    </div>
  );
}
