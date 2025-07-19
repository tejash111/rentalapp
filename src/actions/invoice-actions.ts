'use server'

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { asset, payment, purchase, user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
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

            const htmlContent = 
    } catch (error) {
        console.log(error);
        
    }
}