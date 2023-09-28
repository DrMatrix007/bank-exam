import { transactions } from "@/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { accountId, value } = await req.json();

    try {
        const { id } = await transactions.create({
            data: {
                accountId,
                value,
            },
        });
        return NextResponse.json({ id });
    } catch (e) {
        return NextResponse.json("bad request", {
            status: 400,
        });
    }
}
