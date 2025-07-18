
import { getAllCategoriesAction, GetAllItemsCountAction, GetAllUserCountAction } from '@/actions/admin-actions'
import CategoryManager from '@/components/admin/category-manager'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Users } from 'lucide-react'
import React from 'react'

const SettingsPage = async() => {

  const [categories,userCount,itemCount]=await Promise.all([
    getAllCategoriesAction(),
    GetAllUserCountAction(),
    GetAllItemsCountAction()

  ])
  return (
    <div className='container py-10'>
      <h1 className='text-3xl font-normal mt-10 px-5'>Admin Settings</h1>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-5 mb-7'>
        <Card className='m-5'> 
          <CardHeader className='pb-2'>
            <CardTitle className='flex items-center text-lg font-normal gap-2'>
              <Users/>
              Total Users
            </CardTitle>
            <CardDescription>All Registered Users</CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-3xl font-medium'>{userCount}</p>
            </CardContent>
            </Card>

            <Card className='m-5'>
           <CardHeader className='pb-2'>
            <CardTitle className='flex items-center text-lg font-normal gap-2'>
              <Package/>
              Total Assets
            </CardTitle>
            <CardDescription>All Rental Items</CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-3xl font-medium'>{itemCount}</p>
            </CardContent>
          
        </Card>

      </div>
      <Card className='m-5'>
           <CardHeader className='pb-2'>
            <CardTitle className='flex items-center text-lg font-normal gap-2'>
              Category Management
            </CardTitle>
            </CardHeader>
            <CardContent>
              <CategoryManager categories={categories}/>
            </CardContent>
          
        </Card>
    </div>
  )
}

export default SettingsPage