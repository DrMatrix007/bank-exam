import { accounts, isAccountBlocked } from "@/prisma";
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
    let id_param = -1;
    try {
        const params = req.url.substring(req.url.indexOf("?"));
        id_param = parseInt(new URLSearchParams(params).get("id")!);
    } catch (e) {
        return NextResponse.json("bad request", {
            status: 400,
        });
    }
    const account = await accounts.findUnique({
        where: {
            id: id_param,
        },
    });

    if (account) {
        if (isAccountBlocked(account)) {
            return NextResponse.json("account blocked",{
               status: 400 
            });

        }
        return NextResponse.json({ account });
    } else {
        return NextResponse.json("not found", {
            status: 404,
        });
    }
}

export async function PATCH(req: Request) {
    try {
        const { accountId, block } = await req.json();

        await accounts.update({
            where: {
                id: accountId,
            },
            data: {
                accountType: {
                    set: block ? 0 : 1,
                },
            },
        });
    } catch (e) {
        return NextResponse.json("bad request", {
            status: 400,
        });
    }
    return NextResponse.json("updated");
}
