import { NextRequest, NextResponse } from "next/server";
import { register } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role, phone } = body;
    if (!name || !email || !password) return NextResponse.json({ error: "جميع الحقول مطلوبة" }, { status: 400 });
    
    const user = await register({ name, email, password, role: role || "CUSTOMER", phone });
    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "خطأ في التسجيل" }, { status: 400 });
  }
}
