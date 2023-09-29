import { accounts, isAccountBlocked, transactions } from "@/prisma";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { action: "deposit" | "withdrawal" } }
): Promise<NextResponse> {
    let accountId = 0;
    let value = 0;

    // check if the value is actually correct
    if (params.action !== "deposit" && params.action !== "withdrawal") {
        return NextResponse.json("not found", {
            status: 404,
        });
    }

    //extract information from the request, and validate it
    try {
        const json = await req.json();

        accountId = parseInt(json.accountId);
        value = parseInt(json.value);

        if (!accountId || value <= 0) {
            throw new Error();
        }
    } catch (e) {
        return NextResponse.json("bad request", {
            status: 400,
        });
    }

    // find account
    const account = await accounts.findUnique({
        where: {
            id: accountId,
        },
    });

    // if account exist
    if (!account) {
        return NextResponse.json("account does not exist", {
            status: 404,
        });
    }

    // if account is blocked
    if (isAccountBlocked(account)) {
        return NextResponse.json("account blocked", {
            status: 400,
        });
    }

    //check if action is valid
    if (params.action === "withdrawal") {
        if (account.balance < value) {
            return NextResponse.json("not enough money");
        }
    }

    // create transaction
    const { id } = await transactions.create({
        data: {
            accountId,
            value: (params.action === "deposit" ? 1 : -1) * value,
        },
    });

    // update account
    const { balance: currentBalance } = await accounts.update({
        where: {
            id: accountId,
        },
        data: {
            balance:
                // 2 options: deposit, and withdrawal
                {
                    increment: params.action === "deposit" ? value : -value,
                },
        },
    });

    return NextResponse.json({ transactionId: id, currentBalance });
}
