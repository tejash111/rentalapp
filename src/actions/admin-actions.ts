"use server"
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { category, user } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import {success, z}  from "zod"

const CategorySchema=z.object({
    name : z.string().min(2,'Category Name must be atleast 2 Characters').max(50,'Catogory Name max must be 50 Characters')
});

export type CatogoryFormValues = z.infer<typeof CategorySchema>

export async function AddNewCategoryAction(formData : FormData){
    const session = await auth.api.getSession({
        headers : await headers(),
    })

    if (!session?.user || session.user.role !== 'admin'){
        throw new Error('You must be an admin to add Categories')
    }

    try {
        const name=formData.get('name') as string;

        const validateFields = CategorySchema.parse({name})

        const existingCategory = await db.select().from(category).where(eq(category.name,validateFields.name)).limit(1)

        if (existingCategory.length >0){
            return{
                success : false,
                message: "Category already Exist pls try with diff name"
            }
        }

        await db.insert(category).values({
            name : validateFields.name
        })

        revalidatePath('/admin/settings')
        return {
            success : true,
            message:"New Category added"
        }
    } catch (error) {
        console.log(error); 
        return {
            success:false,
            message:"An error occured while adding pls try again"
        }
    }
}

export async function getAllCategoriesAction(){
    try {
        return await db.select().from(category).orderBy(category.name)
    } catch (error) {
        console.log(error);
        return []
    }
}

export async function GetAllUserCountAction(){
    const session = await auth.api.getSession({
        headers : await headers(),
    })

    if (!session?.user || session.user.role !== 'admin'){
        throw new Error('You must be an admin to add Categories')
    }

    try {
        const result = await db.select({count : sql<number>`count(*)`}).from(user)
        return result[0]?.count || 0
    } catch (error) {
        console.log(error);
        return 0;
    }
}

export async function deleteCategoryAction(categoryId : number){

    const session = await auth.api.getSession({
        headers : await headers(),
    })

    if (!session?.user || session.user.role !== 'admin'){
        throw new Error('You must be an admin to delete this Category')
    }

    try {
        await db.delete(category).where(eq(category.id,categoryId))
        revalidatePath('/admin/settings')
        return{
            success:true,
            message:'category deleted successfully'
        }
    } catch (error) {
        console.log(error);
        return{
            success:false,
            message:'failed to delete category'
        }
        
    }
}
