import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();


export const accounts = prisma.account;
export const transactions = prisma.transaction;
