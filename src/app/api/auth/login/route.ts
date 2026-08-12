import { NextRequest, NextResponse } from "next/server";
import { login, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "البريد وكلمة المرور مطلوبان" }, { status: 400 });
    
    const user = await login(email, password);
    if (!user) return NextResponse.json({ error: "بيانات الدخول غير صحيحة" }, { status: 401 });

    await setSessionCookie(user.id);

    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "خطأ" }, { status: 500 });
  }
}
