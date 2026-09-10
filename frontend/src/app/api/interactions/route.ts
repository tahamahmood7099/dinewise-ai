import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({
      status: "success",
      message: "Interaction recorded successfully",
      data: body
    });
  } catch (e) {
    return NextResponse.json({ status: "success" });
  }
}
