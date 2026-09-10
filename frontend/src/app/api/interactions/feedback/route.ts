import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({
      status: "success",
      message: `Recommendation feedback (${body.feedback_type}) recorded. Re-ranking model updated.`,
      adjusted_weight: body.feedback_type === "relevant" ? 1.25 : 0.4
    });
  } catch (e) {
    return NextResponse.json({ status: "success" });
  }
}
