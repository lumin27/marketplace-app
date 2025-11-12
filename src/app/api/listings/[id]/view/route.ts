import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const listingId = params.id;

    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    const viewerId = null;

    await prisma.listingView.create({
      data: {
        listingId,
        viewerId,
        ip,
        userAgent,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving listing view:", error);
    return NextResponse.json(
      { success: false, error: "Failed to track listing view" },
      { status: 500 }
    );
  }
}
