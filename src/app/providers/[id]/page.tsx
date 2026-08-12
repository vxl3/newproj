import { getDB } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { Header } from "@/components/Header";
import Link from "next/link";
import { Star, MapPin, Clock, Phone, BadgeCheck, ArrowLeft, Calendar, Wallet } from "lucide-react";
import { notFound } from "next/navigation";
import BookingWidget from "./BookingWidget";

export default async function ProviderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDB();
  const user = await getSessionUser();
  const provider = db.providers.find(p => p.id === id);
  if (!provider) return notFound();

  const services = db.services.filter(s => s.providerId === id);
  const reviews = db.reviews.filter(r => r.providerId === id);
  const enrichedReviews = reviews.map(r => {
    const u = db.users.find(u => u.id === r.userId);
    return { ...r, userName: u?.name || "مستخدم" };
  });

  return (
    <div className="min-h-screen bg-[#fbfbfd]">
      <Header user={user ? { id: user.id, name: user.name, role: user.role } : null} />

      <div className="pt-[52px]">
        {/* Cover */}
        <div className="relative h-[320px] overflow-hidden">
          <img src={provider.coverImage} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 p-6">
            <div className="max-w-[1200px] mx-auto flex items-end gap-4">
              <div className="w-20 h-20 rounded-[20px] overflow-hidden border-[3px] border-white shadow-xl">
                <img src={provider.image} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="text-white pb-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-[26px] font-semibold tracking-[-0.02em]">{provider.businessName}</h1>
                  {provider.isVerified && <BadgeCheck className="w-5 h-5 text-blue-400 fill-white" />}
                </div>
                <div className="flex items-center gap-3 text-[13px] text-white/80 mt-1">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{provider.address}</span>
                  <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />{provider.rating} ({provider.reviewCount})</span>
                </div>
              </div>
            </div>
          </div>
          <Link href="/providers" className="absolute top-6 left-6 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 py-8 grid lg:grid-cols-[1fr_380px] gap-8">
          <div className="space-y-6">
            <div className="glass-card rounded-[20px] p-6">
              <h2 className="font-semibold text-[16px] mb-3">عن المكان</h2>
              <p className="text-[14px] leading-6 text-black/70">{provider.description}</p>
              
              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="rounded-[14px] bg-[#f5f5f7] p-3">
                  <Clock className="w-4 h-4 mb-2" />
                  <div className="text-[11px] text-black/50">ساعات العمل</div>
                  <div className="text-[13px] font-medium">{provider.openTime} - {provider.closeTime}</div>
                </div>
                <div className="rounded-[14px] bg-[#f5f5f7] p-3">
                  <Phone className="w-4 h-4 mb-2" />
                  <div className="text-[11px] text-black/50">اتصل بنا</div>
                  <div className="text-[13px] font-medium" dir="ltr">{provider.phone}</div>
                </div>
                <div className="rounded-[14px] bg-[#f5f5f7] p-3">
                  <MapPin className="w-4 h-4 mb-2" />
                  <div className="text-[11px] text-black/50">المدينة</div>
                  <div className="text-[13px] font-medium">{provider.city}</div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-semibold text-[18px] mb-4">الخدمات ({services.length})</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {services.map(s => (
                  <div key={s.id} className="glass-card rounded-[18px] p-3 flex gap-3 hover:shadow-md transition-shadow">
                    <img src={s.image} alt="" className="w-20 h-20 rounded-[12px] object-cover" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-[14px]">{s.name}</h3>
                      <p className="text-[12px] text-black/60 line-clamp-2 mt-1 leading-4">{s.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[13px] font-semibold flex items-center gap-1"><Wallet className="w-3 h-3" />{s.price.toLocaleString()} د.ع</span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-black/5">{s.duration} دقيقة</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-[20px] p-6">
              <h2 className="font-semibold text-[16px] mb-4">التقييمات</h2>
              <div className="space-y-4">
                {enrichedReviews.map(r => (
                  <div key={r.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[12px] font-medium">{r.userName[0]}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium">{r.userName}</span>
                        <span className="flex items-center gap-0.5">
                          {Array.from({ length: r.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                        </span>
                      </div>
                      <p className="text-[13px] text-black/70 mt-1">{r.comment}</p>
                    </div>
                  </div>
                ))}
                {enrichedReviews.length === 0 && <div className="text-[13px] text-black/50">لا توجد تقييمات بعد</div>}
              </div>
            </div>
          </div>

          {/* Booking Widget */}
          <div className="lg:sticky top-[80px] h-fit">
            <BookingWidget provider={provider} services={services} user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}
