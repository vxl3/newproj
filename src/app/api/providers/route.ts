import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function GET(req: NextRequest) {
  const db = await getDB();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search")?.toLowerCase();
  const city = searchParams.get("city");

  let providers = db.providers;

  if (category) providers = providers.filter(p => p.category === category);
  if (city) providers = providers.filter(p => p.city.includes(city));
  if (search) {
    providers = providers.filter(p => 
      p.businessName.toLowerCase().includes(search) ||
      p.description.toLowerCase().includes(search)
    );
  }

  // enrich with services count
  const result = providers.map(p => ({
    ...p,
    servicesCount: db.services.filter(s => s.providerId === p.id).length,
    minPrice: Math.min(...db.services.filter(s => s.providerId === p.id).map(s => s.price), 0)
  }));

  return NextResponse.json(result);
}
