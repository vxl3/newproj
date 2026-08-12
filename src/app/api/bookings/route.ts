import { NextRequest, NextResponse } from "next/server";
import { getDB, saveDB } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  
  const db = await getDB();
  let bookings = db.bookings;
  
  if (user.role === "CUSTOMER") {
    bookings = bookings.filter(b => b.userId === user.id);
  } else if (user.role === "PROVIDER") {
    const myProviderIds = db.providers.filter(p => p.userId === user.id).map(p => p.id);
    bookings = bookings.filter(b => myProviderIds.includes(b.providerId));
  }
  // ADMIN sees all

  // enrich
  const enriched = bookings.map(b => {
    const provider = db.providers.find(p => p.id === b.providerId);
    const service = db.services.find(s => s.id === b.serviceId);
    const customer = db.users.find(u => u.id === b.userId);
    return { ...b, provider, service, customer: customer ? { id: customer.id, name: customer.name } : null };
  }).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json(enriched);
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "سجل دخول أولاً" }, { status: 401 });

  const body = await req.json();
  const { providerId, serviceId, date, startTime, notes } = body;
  if (!providerId || !serviceId || !date || !startTime) {
    return NextResponse.json({ error: "بيانات ناقصة" }, { status: 400 });
  }

  const db = await getDB();
  const service = db.services.find(s => s.id === serviceId);
  if (!service) return NextResponse.json({ error: "الخدمة غير موجودة" }, { status: 404 });

  // calc endTime
  const [h, m] = startTime.split(":").map(Number);
  const endMin = m + service.duration;
  const endH = h + Math.floor(endMin / 60);
  const endM = endMin % 60;
  const endTime = `${String(endH).padStart(2,"0")}:${String(endM).padStart(2,"0")}`;

  // check conflict for same provider/date/time
  const conflict = db.bookings.find(b => b.providerId === providerId && b.date === date && b.startTime === startTime && b.status !== "CANCELLED");
  if (conflict) return NextResponse.json({ error: "هذا الوقت محجوز مسبقاً" }, { status: 409 });

  const newBooking = {
    id: "b" + Date.now(),
    userId: user.id,
    providerId,
    serviceId,
    date,
    startTime,
    endTime,
    status: "PENDING" as const,
    notes,
    createdAt: new Date().toISOString(),
  };

  db.bookings.push(newBooking);
  await saveDB(db);

  return NextResponse.json(newBooking);
}

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { id, status } = await req.json();
  const db = await getDB();
  const booking = db.bookings.find(b => b.id === id);
  if (!booking) return NextResponse.json({ error: "غير موجود" }, { status: 404 });

  // check ownership
  const isOwnerProvider = db.providers.some(p => p.id === booking.providerId && p.userId === user.id);
  if (user.role !== "ADMIN" && booking.userId !== user.id && !isOwnerProvider) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  booking.status = status;
  await saveDB(db);
  return NextResponse.json(booking);
}
