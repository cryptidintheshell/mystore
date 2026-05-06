import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session/session";
import { searchGlobalItems } from "@/lib/inventory/inventory";

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session || !session.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q");

        if (!query) return NextResponse.json([]);

        const items = await searchGlobalItems(query);
        return NextResponse.json(items);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
