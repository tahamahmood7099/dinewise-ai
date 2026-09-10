import { NextResponse } from "next/server";
import { DEMO_USERS } from "../../../../lib/server-data";

export async function GET() {
  return NextResponse.json(DEMO_USERS);
}
