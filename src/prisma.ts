import { Account, PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();


export const accounts = prisma.account;
export const transactions = prisma.transaction;

export const isAccountBlocked = (e:Account): boolean => {
    return e.accountType == 0;
}