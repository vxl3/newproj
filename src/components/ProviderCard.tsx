"use client";
import Link from "next/link";
import { Star, MapPin, Clock, BadgeCheck, ArrowUpRight } from "lucide-react";
import { Provider } from "@/lib/types";

const categoryLabels: Record<string, { label: string; color: string }> = {
  BARBER: { label: "حلاقة", color: "bg-amber-100 text-amber-700" },
  CLINIC: { label: "عيادة", color: "bg-blue-100 text-blue-700" },
  SALON: { label: "تجميل", color: "bg-pink-100 text-pink-700" },
  FIELD: { label: "ملعب", color: "bg-green-100 text-green-700" },
  GYM: { label: "نادي", color: "bg-purple-100 text-purple-700" },
  OTHER: { label: "أخرى", color: "bg-gray-100 text-gray-700" },
};

export function ProviderCard({ provider }: { provider: Provider }) {
  const cat = categoryLabels[provider.category] || categoryLabels.OTHER;
  
  return (
    <Link href={`/providers/${provider.id}`} className="group block">
      <div className="glass-card rounded-[24px] overflow-hidden p-2.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500">
        <div className="relative h-[200px] rounded-[18px] overflow-hidden bg-gray-100">
          <img src={provider.coverImage} alt={provider.businessName} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-md ${cat.color} bg-white/90`}>{cat.label}</span>
            {provider.isVerified && (
              <span className="w-6 h-6 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center">
                <BadgeCheck className="w-4 h-4 text-blue-600" />
              </span>
            )}
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[12px] font-medium">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {provider.rating} <span className="text-black/50">({provider.reviewCount})</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-black group-hover:text-white transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          <div className="absolute -bottom-6 left-4 w-12 h-12 rounded-[14px] overflow-hidden border-[3px] border-white shadow-lg">
            <img src={provider.image} alt="" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="pt-8 px-3 pb-3">
          <h3 className="font-semibold text-[15px] leading-5 tracking-[-0.01em] line-clamp-1">{provider.businessName}</h3>
          <p className="text-[13px] text-black/60 leading-5 line-clamp-2 mt-1.5 min-h-[40px]">{provider.description}</p>
          
          <div className="flex items-center gap-3 mt-3 text-[12px] text-black/50">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{provider.city}</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{provider.openTime} - {provider.closeTime}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
