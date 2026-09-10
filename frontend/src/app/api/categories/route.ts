import { NextResponse } from "next/server";
import { CUISINE_CATEGORIES } from "../../../lib/server-data";

export async function GET() {
  return NextResponse.json(CUISINE_CATEGORIES);
}
