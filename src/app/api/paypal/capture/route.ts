import { recordPurchaseAction } from "@/actions/payment-actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


const GET=async(request : NextRequest)=>{
    const searchParams = request.nextUrl.searchParams;
    const token=searchParams.get('token')
    const assetId = searchParams.get('assetId')
    const payerId = searchParams.get('PayerId')

    //do it later : if something missing redired to items page with missing params ? missing-parmas4
    if (!token || !payerId || !assetId){
        return NextResponse.redirect(new URL(`/item?error=missing-params`,request.url))
    }

    try {
        const session = await auth.api.getSession({
            headers : await headers()
        })

        if (!session?.user.id){
            return NextResponse.redirect(new URL('/login',request.url))
        }

        const response = await fetch(`${process.env.PAYPAL_API_URL}/v2/checkout/orders/${token}/capture`,{
            method : 'POST',
            headers : {
                'Content-type' : 'application/json',
                Authorization : `Basic ${Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64')}`
            },
        })

        const data = await response.json()

        if (data.status==='COMPLETED'){
            //stroe the purchase info in db
            const savetoDB = await recordPurchaseAction(assetId,token,session.user.id,5.0)
            if (!savetoDB.success){
                return NextResponse.redirect(new URL(`/items/${assetId}?error=recording_failed`,request.url))
            }else{
                return NextResponse.redirect(new URL(`/items/${assetId}?success=true`,request.url))
            }
        }else{
            return NextResponse.redirect(new URL(`/items/${assetId}?error=payment_failed`,request.url))
        }
        
    } catch (error) {
        console.error(error);
        return NextResponse.redirect(new URL(`/items/${assetId}?error=server_error`,request.url))
        
    }
}