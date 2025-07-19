'use server'

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { asset, invoice, payment, purchase, user } from "@/lib/db/schema";
import { genrateInvoiceHtml } from "@/lib/invoice/invoice-html-gen";
import { error } from "console";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import {v4 as uuidv4} from 'uuid'
import { success } from "zod";
export async function  createInvoiceAction(purchaseId : string) {
    try {
        const session = await auth.api.getSession({
                headers : await headers(),
            })
        
            if (!session?.user.id ){
                return{
                    success :false,
                    error :'Not authenticated'
                }
            }

            const [purchaseData]= await db.select({
                purchase : purchase,
                asset : asset,
                payment : payment,
                user : user
            }).from(purchase).innerJoin(asset,eq(purchase.assetId,asset.id)).
            innerJoin(payment,eq(purchase.paymentId,payment.id)).
            innerJoin(user,eq(purchase.userId,user.id)).
            where(eq(purchase.id,purchaseId)).limit(1);

            if (!purchaseData){
                return{
                    success:false,
                    error: 'Purchase not found!!!'
                }
            }

            if (purchaseData.purchase.userId !== session.user.id){
                return {
                    success :false,
                    error : 'Not Authorized'
                }
            }

            const invoiceNumber = `INV-${new Date().getFullYear()}${(new Date().getMonth() +1).toString().padStart(2, "0")}-${Math.floor(1000 + Math.random()*8000)}}`

            const htmlContent = genrateInvoiceHtml(
                invoiceNumber,
                new Date(purchaseData.purchase.createdAt),
                purchaseData.asset.title,
                purchaseData.purchase.price
            )

            const [newInvoice] = await db.insert(invoice).values({
                id : uuidv4(),
                invoiceNumber,
                purchaseId : purchaseData.purchase.id,
                userId : purchaseData.user.id,
                amount : purchaseData.purchase.price,
                currency : 'USD',
                status : 'paid',
                htmlContent,
                createdAt : new Date(),
                updatedAt : new Date()
            }).returning()

            revalidatePath('/dashboard/orders')

            return {
                success : true,
                invoiceId : newInvoice.id,
            }
    } catch (error) {
        console.error(error);
        return { 
            success :false,
            error : 'failed to create invoice'
        }
    }
}

export async function getUsersInvoicesAction() {
    try {
         const session = await auth.api.getSession({
                headers : await headers(),
            })
        
            if (!session?.user.id ){
                return{
                    success :false,
                    error :'Not authenticated'
                }
            }

        const userInvoices = await db.select().from(invoice).where(eq(invoice.userId,session.user.id)).orderBy(invoice.createdAt)

        return {
            success : true,
            invoices : userInvoices
        }
    } catch (error) {
        return{
            success :false,
            error : 'failed to fetch user invoices'
        }
    }
}

export async function getInvoiceHtmlAction(invoiceId: string) {
    try {
        const session = await auth.api.getSession({
                headers : await headers(),
            })
        
            if (!session?.user.id ){
                return{
                    success :false,
                    error :'Not authenticated'
                }
            }

        const [invoiceData]=await db.select().from(invoice).where(eq(invoice.id,invoiceId)).limit(1)

    if (!invoiceData){
        return {
            success : false,
            error : "Invoice not found"
        }
    }

    if (invoiceData.userId !== session.user.id){
                return {
                    success :false,
                    error : 'Not Authorized'
                }
            }

    if (!invoiceData.htmlContent){
        return {
            success : false,
            error : 'Invoice content not found'
        }
    }
    return {
        success :false,
        html : invoiceData.htmlContent
    }
    } catch (error) {
    console.error(error);
    return{
        success :false,
        error : 'Invoice html content not found'
    }
    
    }
}

export async function getInvoiceHtmlByIdAction(invoiceId: string) {
    try {
        const session = await auth.api.getSession({
                headers : await headers(),
            })
        
            if (!session?.user.id ){
                return{
                    success :false,
                    error :'Not authenticated'
                }
            }

        const [invoiceData]=await db.select().from(invoice).where(eq(invoice.id,invoiceId)).limit(1)

    if (!invoiceData){
        return {
            success : false,
            error : "Invoice not found"
        }
    }

    if (invoiceData.userId !== session.user.id){
                return {
                    success :false,
                    error : 'Not Authorized'
                }
            }

    if (!invoiceData){
        return {
            success : false,
            error : 'Invoice content not found'
        }
    }
    return {
        success :false,
        invoice : invoiceData
    }
    } catch (error) {
    console.error(error);
    return{
        success :false,
        error : 'Invoice html content not found'
    }
    
    }
}

