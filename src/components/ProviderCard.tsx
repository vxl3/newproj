"use client";
import Link from "next/link";
import { Star, MapPin, Clock, BadgeCheck, ArrowUpRight } from "lucide-react";
import { Provider } from "@/lib/types";
import { motion } from "framer-motion";

const categoryLabels: Record<string, { label: string; color: string; gradient: string }> = {
  BARBER: { label: "حلاقة", color: "bg-amber-100 text-amber-700", gradient: "from-amber-500 to-orange-500" },
  CLINIC: { label: "عيادة", color: "bg-blue-100 text-blue-700", gradient: "from-blue-500 to-cyan-500" },
  SALON: { label: "تجميل", color: "bg-pink-100 text-pink-700", gradient: "from-pink-500 to-rose-500" },
  FIELD: { label: "ملعب", color: "bg-green-100 text-green-700", gradient: "from-green-500 to-emerald-500" },
  GYM: { label: "نادي", color: "bg-purple-100 text-purple-700", gradient: "from-purple-500 to-violet-500" },
  OTHER: { label: "أخرى", color: "bg-gray-100 text-gray-700", gradient: "from-gray-500 to-slate-500" },
};

export function ProviderCard({ provider }: { provider: Provider }) {
  const cat = categoryLabels[provider.category] || categoryLabels.OTHER;
  
  return (
    <Link href={`/providers/${provider.id}`} className="group block">
      <motion.div 
        className="glass-card rounded-[24px] overflow-hidden p-2.5 card-hover"
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="relative h-[200px] rounded-[18px] overflow-hidden bg-gray-100">
          <motion.img 
            src={provider.coverImage} 
            alt={provider.businessName} 
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <motion.span 
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-md bg-white/90 ${cat.color}`}
              whileHover={{ scale: 1.05 }}
            >
              {cat.label}
            </motion.span>
            {provider.isVerified && (
              <motion.span 
                className="w-6 h-6 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                <BadgeCheck className="w-4 h-4 text-blue-600" />
              </motion.span>
            )}
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[12px] font-medium"
              whileHover={{ scale: 1.05 }}
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {provider.rating} <span className="text-black/50">({provider.reviewCount})</span>
            </motion.div>
            <motion.div 
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-black group-hover:text-white transition-colors"
              whileHover={{ rotate: 45 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowUpRight className="w-4 h-4" />
            </motion.div>
          </div>

          <motion.div 
            className="absolute -bottom-6 left-4 w-12 h-12 rounded-[14px] overflow-hidden border-[3px] border-white shadow-lg"
            whileHover={{ scale: 1.1, y: -4 }}
            transition={{ duration: 0.3 }}
          >
            <img src={provider.image} alt="" className="w-full h-full object-cover" />
          </motion.div>
        </div>

        <div className="pt-8 px-3 pb-3">
          <h3 className="font-semibold text-[15px] leading-5 tracking-[-0.01em] line-clamp-1 group-hover:text-violet-600 transition-colors">{provider.businessName}</h3>
          <p className="text-[13px] text-black/60 leading-5 line-clamp-2 mt-1.5 min-h-[40px]">{provider.description}</p>
          
          <div className="flex items-center gap-3 mt-3 text-[12px] text-black/50">
            <span className="flex items-center gap-1 group-hover:text-violet-500 transition-colors">
              <MapPin className="w-3.5 h-3.5" />
              {provider.city}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {provider.openTime} - {provider.closeTime}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
