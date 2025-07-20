"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import {v4 as uuidv4} from 'uuid'
import { asset, payment, purchase } from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { success } from "zod"
import { createInvoiceAction, getUsersInvoicesAction } from "./invoice-actions"

export async function createPaypalOrderAction(assetId:string) {
    const session = await auth.api.getSession({
            headers : await headers()
        })
    
        if (!session?.user.id){
            redirect('/login')
            throw new Error('You must be logged in to Rent')
        }

    const [getAsset] = await db.select().from(asset).where(eq(asset.id,assetId))
    if (!getAsset){
        throw new Error('Asset not found')
    }
    // const existingPurchase = await db.select().from(purchase)
    // .where(and(eq(purchase.assetId,assetId), eq(purchase.userId,session.user.id))).limit(1);

    // if (existingPurchase.length>0){
    //     return {
    //         alreadyPurchased : true
    //     };
    // }

    try {
        const response=await fetch(`${process.env.PAYPAL_API_URL}/v2/checkout/orders`,{
            method : 'POST',
            headers : {
                'Content-type' : 'application/json',
                Authorization : `Basic ${Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64')}`
            },
            body : JSON.stringify({
                intent : 'CAPTURE',
                purchase_units : [
                    {
                        reference_id : assetId,
                        description : `Purchase of ${getAsset.title}`,
                        amount : {
                            currency_code : 'USD',
                            value : (getAsset.pricePerDay ? (getAsset.pricePerDay / 86).toFixed(2) : "0.00")
                        },
                        custom_id : `${session.user.id}|${assetId}`
                    }
                ],
                application_context : {
                    return_url : `${process.env.APP_URL}/api/paypal/capture?assetId=${assetId}`,
                    cancel_url : `${process.env.APP_URL}/items/${assetId}?cancelled=true`
                }
            })
        })

        const data = await response.json()

        if (data.id){
            return{
                // log this data.id to recheck or understand
                orderId : data.id,
                approvalLink : data.links.find((link : any)=> link.rel === 'approve').href,
            }
        }
    } catch (error) {
        console.error(error);
        throw new Error('Failed to create paypal order')
        
        
    }
}

export async function recordPurchaseAction(assetId : string,paypalOrderId : string,userId:string,pricePerDay:number | null) {
   
    if (pricePerDay == null) {
        throw new Error("pricePerDay is required to record a purchase");
      }

    try {
         const existingPurchase = await db.select().from(purchase)
          .where(and(eq(purchase.assetId,assetId), eq(purchase.userId,userId))).limit(1);

          const paymentUuid=uuidv4()
          const purchaseUuid=uuidv4()

          await db.insert(payment).values({
            id : paymentUuid,
            amount : pricePerDay,
            currency : 'USD',
            status : 'completed',
            provider : 'paypal',
            providerId : paypalOrderId,
            userId : userId,
            createdAt : new Date(),
          })

          await db.insert(purchase).values({
            id : purchaseUuid,
            assetId,
            userId,
            paymentId : paymentUuid,
            price : pricePerDay,
            createdAt : new Date() 
          })

          //create invoice
          const invoiceResult= await createInvoiceAction(purchaseUuid)
          if (!invoiceResult.success){
            console.error('Failed to create invoice');
            
          }
          
          revalidatePath(`items/${assetId}`)
          revalidatePath(`/dashboard/orders`)
          return {
            success : true, purchaseId : purchaseUuid
          }
    } catch (error) {
        return{
            success :false,
            error : 'Failed to save purchase and payment info'
        }
    }
}

export async function hasUserPurchasedItemAction(assetId : string){
    const session = await auth.api.getSession({
            headers : await headers()
        })
    
        if (!session?.user.id){
            return false
        }

        try {
            const existingPurchase = await db.select().from(purchase)
          .where(and(eq(purchase.assetId,assetId), eq(purchase.userId,session.user.id))).limit(1);

    if (existingPurchase.length>0){
        return {
            alreadyPurchased : true
        };
    }

    return existingPurchase.length>0
        } catch (error) {
            return false
        }
}

export async function getAllUserPurchasedItemAction(){
    const session = await auth.api.getSession({
            headers : await headers()
        })
    
        if (!session?.user.id){
            redirect('/login')
        }        
        

        try {
            const userPurchases = await db.select({
                purchase : purchase,
                asset : asset
            }).from(purchase).innerJoin(asset,eq(purchase.assetId,asset.id)).where(eq(purchase.userId,session.user.id)).orderBy(purchase.createdAt)

            return userPurchases;
        } catch (error) {
            console.log(error);
            return [];
            
        }
}