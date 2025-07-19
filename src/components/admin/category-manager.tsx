"use client"

import { Ghost, Plus, Trash2 } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import React, { useState } from "react"
import { AddNewCategoryAction, deleteCategoryAction } from "@/actions/admin-actions"
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { resourceUsage } from "process"


type Category={
    id:number,
    name:string,
    createdAt: Date
}

interface CategoryManagerProps{
    categories : Category[]
}

const CategoryManager = ({categories : initialCategories} :CategoryManagerProps) => {

    const [categories,setCategories]=useState<Category[]>(initialCategories)
    const [newCategoryName,setNewCategoryName]=useState('')

    

    const handleAddNewCategory=async(event : React.FormEvent)=>{
        event.preventDefault()
        try {   
            const formData = new FormData()
            formData.append('name',newCategoryName)
            const res = await AddNewCategoryAction(formData)

            if (res && res.success){
                const newCategory = {
                    id : Math.max(0,...categories.map(c=>c.id))+1,
                    name:newCategoryName,
                    createdAt : new Date()
                }
                setCategories([...categories,newCategory])
                setNewCategoryName('')
                toast.success("New cateogry added")
            }
        } catch (error) {
            console.log(error);
            toast.error('failed to add category')
        }
    }

    const handleDeleteCategory= async(categoryId : number)=>{
        console.log('error');
        
        const result = await deleteCategoryAction(categoryId)

        if (result.success){
            setCategories(categories.filter(c=>c.id !== categoryId))
        }
    }

  return (
    <div className='space-y-6 '>
        <form onSubmit={handleAddNewCategory} className="space-y-4">
            <div className="sapce-y-2">
                <Label htmlFor="categoryName" className="mb-2">New Category</Label>
                <div className="flex gap-2" >
                <Input 
                value={newCategoryName}
                onChange={(e)=>setNewCategoryName(e.target.value)}
                id="categoryName"
                placeholder="Enter Category Name"
                />
                <Button type="submit"><Plus className="w-4 h-4 mr-2"/>Add</Button>
                </div>
            </div>
        </form>
        <div>
            <h3 className="text-lg font-normal mb-4">Categories</h3>
            {
                categories.length ===0?
                <p>No Categories Avilable</p>:
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            categories.map(category=>(
                                <TableRow key={category.id}>
                                    <TableCell>
                                        {category.name}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(category.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Button onClick={()=>handleDeleteCategory(category.id)} variant={'ghost'} size={'icon'}>
                                            <Trash2 className="h-5 w-5 text-red-500"/>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            }
        </div>
    </div>
  )
}

export default CategoryManager