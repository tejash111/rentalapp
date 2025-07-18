

import { approveItemAction, getPendingItemAction, rejectItemAction } from '@/actions/admin-actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { username } from 'better-auth/plugins'
import { formatDistanceToNow } from 'date-fns'
import { User } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const AssetApprovalPage = async() => {

  const pendingItems =await getPendingItemAction()

  return  (
    <div className=' mt-25 px-8'>
      {
        pendingItems.length === 0 ? (
      <Card className='bg-white '>
        <CardContent className='py-16 flex flex-col items-center justify-center'>
          <p className='text-center text-slate-600 text-lg'>All Item Have been Reviewed</p>
        </CardContent>
      </Card>
  ) :  <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 ">
      {
        pendingItems.map(({item,userName})=>(
          <div key={item.id} className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow ">
            <div className="h-48 bg-slate-100 relative">
              <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover "
              />
              <div className="absolute top-2 right-2 ">
              </div>
            </div>
            <div className="p-4 ">
                  <h2 className="font-normal truncate text-lg">{item.title}</h2>
                  {
                    item.description && (
                      <p className="text-xs text-slate-500">{item.description}</p>
                    )
                  }
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-slate-400">{formatDistanceToNow(new Date(item.createdAt))}</span>
                    <div className='flex items-center text-xs text-slate-500'>
                      <User className='mr-2 w-4 h-4'/>
                      {userName}
                    </div>
                  </div>
            </div>
            <div className='p-4 flex justify-between items-center '>
                  <form 
                  action={
                    async()=>{
                      'use server'
                      await approveItemAction(item.id)
                    }
                  }>
                    <Button size={'sm'} className='bg-green-500 hover:bg-green-600 cursor-pointer'>Approve</Button>
                  </form>
                  <form 
                  action={
                     async()=>{
                      'use server'
                      await rejectItemAction(item.id)
                    }
                  }>
                    <Button size={'sm'} className='bg-red-500 hover:bg-red-600 cursor-pointer'>Reject</Button>
                  </form>
            </div>
          </div>

        ))
      }
    </div>
      }
    </div>
  )
  
}

export default AssetApprovalPage