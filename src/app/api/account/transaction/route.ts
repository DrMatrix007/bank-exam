import { accounts, transactions } from "@/prisma";
import { Transaction } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    //get the account id
    let id_param = 0;
    try {
        const params = req.url.substring(req.url.indexOf("?"));
        id_param = parseInt(new URLSearchParams(params).get("id")!);
    } catch (e) {
        return NextResponse.json("bad request", {
            status: 400,
        });
    }

    //find all transactions
    const result = await transactions.findMany({
        where: {
            accountId: id_param,
        },
        orderBy: {
            transactionDate: "asc",
        },
    });

    return NextResponse.json(convertTransactionToUser(result));
}

function convertTransactionToUser(data: Transaction[]) {
    const ans = [];

    let currentBalance = 0;

    // calculate the current balance in each transaction, and adds it to the list
    for (let i = 0; i < data.length; i++) {
        const { transactionDate, value } = data[i];
        currentBalance += value;
        ans.push({
            value,
            transactionDate,
            currentBalance,
        });
    }
    return ans;
}
