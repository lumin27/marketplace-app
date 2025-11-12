import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messageIds } = await req.json();

    if (!messageIds || !Array.isArray(messageIds)) {
      return NextResponse.json(
        { error: "Message IDs required" },
        { status: 400 }
      );
    }

    await prisma.$executeRaw`
      UPDATE messages 
      SET read_at = NOW() 
      WHERE id = ANY(${messageIds}) 
      AND receiver_id = ${user?.id}
      AND read_at IS NULL
    `;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to mark messages as read" },
      { status: 500 }
    );
  }
}
