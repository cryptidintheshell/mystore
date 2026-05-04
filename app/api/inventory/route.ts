import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session/session";
import { getAllItems } from "@/lib/inventory/inventory";

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session || !session.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const items = await getAllItems(session.userId);
        return NextResponse.json(items);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session || !session.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        // const itemId = await addItem(session.userId, body);
        
        return NextResponse.json({ id: itemId, message: "Item added successfully" }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
