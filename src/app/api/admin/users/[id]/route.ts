import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getDB, saveDB } from "@/lib/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    
    // Only admin can delete users
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    const { id } = await params;
    const db = await getDB();
    
    // Don't allow deleting admins
    const targetUser = db.users.find(u => u.id === id);
    if (!targetUser || targetUser.role === "ADMIN") {
      return NextResponse.json({ error: "لا يمكن حذف هذا المستخدم" }, { status: 400 });
    }

    // Remove user
    db.users = db.users.filter(u => u.id !== id);
    
    // Remove user's bookings
    db.bookings = db.bookings.filter(b => b.userId !== id);
    
    await saveDB(db);

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
