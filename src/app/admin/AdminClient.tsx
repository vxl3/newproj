"use client";
import { useState } from "react";
import { Trash2, X, Check, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DB } from "@/lib/types";

export default function AdminClient({ db }: { db: DB }) {
  const [users, setUsers] = useState(db.users.filter(u => u.role !== "ADMIN"));
  const [bookings, setBookings] = useState(db.bookings);
  const [confirmDelete, setConfirmDelete] = useState<{ type: 'user' | 'booking'; id: string } | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  async function deleteUser(id: string) {
    setLoading(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsers(u => u.filter(x => x.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(null);
    setConfirmDelete(null);
  }

  async function cancelBooking(id: string) {
    setLoading(id);
    try {
      const res = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "CANCELLED" }),
      });
      if (res.ok) {
        setBookings(b => b.map(x => x.id === id ? { ...x, status: "CANCELLED" } : x));
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(null);
    setConfirmDelete(null);
  }

  return (
    <>
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-strong rounded-[24px] p-6 max-w-sm w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-[16px]">تأكيد الحذف</h3>
                  <p className="text-[13px] text-black/50">هل أنت متأكد من هذا الإجراء؟</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 h-10 rounded-full bg-black/5 hover:bg-black/10 text-[13px] font-medium transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => {
                    if (confirmDelete.type === 'user') deleteUser(confirmDelete.id);
                    else cancelBooking(confirmDelete.id);
                  }}
                  disabled={!!loading}
                  className="flex-1 h-10 rounded-full bg-red-600 hover:bg-red-700 text-white text-[13px] font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? "جاري..." : "حذف"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
