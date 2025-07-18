'use server'

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { asset, category, user } from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import {date, success, z} from "zod"

const ItemSchema=z.object({
    title : z.string(),
    description : z.string().optional(),
    location : z.string(),
    categoryId: z.number().positive(),
    image : z.string()
})


export const getCategoriesAction =async()=>{
    try {
        return db.select().from(category)
    } catch (error) {
        console.log(error);
        return []
        
    }
}

export const uploadItemAction=async(formData : FormData)=>{

    const session = await auth.api.getSession({
        headers : await headers()
    })

    if (!session?.user){
        throw new Error('You must be logged in to upload Item')
    }

    try {
        const validateFields = ItemSchema.parse({
            title : formData.get('title'),
            description : formData.get('description'),
            location : formData.get('location'),
            categoryId : Number(formData.get('categoryId')),
            image : formData.get('image'),
        })

        await db.insert(asset).values({
            title : validateFields.title,
            description : validateFields.description,
            location :validateFields.location,
            categoryId : validateFields.categoryId,
            image : validateFields.image,
            isApproved : 'pending',
            userId : session.user.id,
            isAvailable : true,
            availableFrom : new Date(),
            availableTo : new Date(),
            pricePerDay : 100
            
        })


        revalidatePath('/dashboards/items')
        return{
            success : true

        }

    } catch (error) {
        console.error(error);
        return{
            success : false,
            error : "failed to upload item"

        }
        
    }
}

export const getUserItemAction=async(userId : string)=>{

    try {
        return await db.select().from(asset).where(eq(asset.userId,userId)).orderBy(asset.createdAt)
    } catch (error) {
        
    }
}

export async function getPublicItemAction(categoryId? : number) {
    try {
        
        //add multiple base condition
        let conditions = and(
            eq(asset.isApproved, 'approved')
        )

        if (categoryId){
            conditions = and(conditions, eq(asset.categoryId,categoryId))
        }
        
        const query = await db.select({
            item : asset,
            categoryName : category.name,
            userName : user.name,
            userImage : user.image
        }).from(asset).leftJoin(category , eq(asset.categoryId,category.id)).leftJoin(user, eq(asset.userId,user.id)).where(conditions)

        return query


    } catch (error) {
        console.error(error);
        return []
        
    }
}

export async function getAssetByIdAction(assetId: string) {
    try {
        const [result] = await db.select({
            item : asset,
            categoryName : category.name,
            userName : user.name,
            userImage : user.image,
            userId : user.id,

        }).from(asset)
        .leftJoin(category , eq(asset.categoryId,category.id))
        .leftJoin(user, eq(asset.userId,user.id))
        .where(eq(asset.id,assetId));

        return result
    } catch (error) {
        return null;
    }
}