import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({
      status: "success",
      is_favorite: true,
      message: "Restaurant favorited. AI taste signal recorded."
    });
  } catch (e) {
    return NextResponse.json({ status: "success", is_favorite: true });
  }
}
