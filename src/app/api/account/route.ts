import { accounts } from "@/prisma";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        //get the request person to add an account
        const { personId } = await req.json();

        // create the account and get it's id
        const { id } = await accounts.create({
            data: {
                personId,
            },
        });

        return NextResponse.json({
            id,
        });
    } catch (e) {
        return NextResponse.json("bad request", {
            status: 400,
        });
    }
}

export async function GET(req: Request) {
    const params = req.url.substring(req.url.indexOf("?"));
    const id_param = new URLSearchParams(params).get("id") ?? "";

    try {
        const account = await accounts.findUnique({
            where: {
                id: parseInt(id_param),
            },
        });
        return NextResponse.json({ account });
    } catch (e) {
        return NextResponse.json("bad request", {
            status: 400,
        });
    }
}
