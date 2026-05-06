import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session/session";
import { getAllItems, addItem } from "@/lib/inventory/inventory";

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session || !session.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const archived = searchParams.get("archived") === "true";

        const items = await getAllItems(session.userId, archived);
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
        const { barcode, productName, size, price, amount, category } = body;

        const result = await addItem(session.userId, barcode, { productName, category, size, price, amount });
        
        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        return NextResponse.json({ message: "Item added successfully" }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
