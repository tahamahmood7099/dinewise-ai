import { NextRequest, NextResponse } from "next/server";
import { DEMO_USERS } from "../../../../lib/server-data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body.email || body.username;
    const user = DEMO_USERS.find((u) => u.email.toLowerCase() === (email || "").toLowerCase()) || DEMO_USERS[0];

    return NextResponse.json({
      access_token: `mock_jwt_token_${user.id}_${Date.now()}`,
      token_type: "bearer",
      user: user
    });
  } catch (e) {
    return NextResponse.json({
      access_token: `mock_jwt_token_1_${Date.now()}`,
      token_type: "bearer",
      user: DEMO_USERS[0]
    });
  }
}
