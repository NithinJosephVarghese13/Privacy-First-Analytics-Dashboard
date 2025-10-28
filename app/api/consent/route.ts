import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const consentSchema = z.object({
  action: z.enum(["grant", "revoke"]),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = consentSchema.parse(body);

    return NextResponse.json({
      success: true,
      consent: data.action === "grant",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}
