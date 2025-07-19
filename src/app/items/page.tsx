

import { getCategoriesAction, getPublicItemAction } from '@/actions/dashboard-actions'
import { Button } from '@/components/ui/button'
import { auth } from '@/lib/auth'
import { formatDistanceToNow } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { headers } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React, { Suspense } from 'react'

interface ItemPageProps {
  searchParams: {
    category?: string;
  }
}

const ItemsPage = async ({ searchParams }: ItemPageProps) => {

  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session && session.user?.role === 'admin') redirect('/')



  return (
    <div className='mt-13 p-4'>
      <Suspense
        fallback={
          <div className='flex items-center justify-center min-h-[65vh]'>
            <Loader2 className='h-8 w-8 animate-spin text-black' />
          </div>
        }
      >
        <ItemContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

export default ItemsPage

async function ItemContent({ searchParams }: ItemPageProps) {
  const params = await searchParams
  const categoryId = params.category ? Number.parseInt(params.category) : undefined

  const categories = await getCategoriesAction()
  const items = await getPublicItemAction(categoryId)
  return (
    <div className='min-h-screen px-4 bg-white '>
      <div className='sticky top-0 z-30 bg-white border-b py-3 px-4'>
        <div className='container flex overflow-x-auto gap-12 '>
          <Button variant={!categoryId ? 'default' : 'outline'} size={'sm'}
            className={!categoryId ? 'bg-black text-white' : ''}
          >
            <Link href={'/items'}>
              All
            </Link>
          </Button>
          {
            categories.map(c => (
              <Button key={c.id} variant={categoryId === c.id ? 'default' : 'outline'}
                className={categoryId === c.id ? 'bg-black text-white' : ""}
                size={'sm'}
                asChild
              >
                <Link href={`/items?category=${c.id}`}>
                  {c.name}
                </Link>
              </Button>
            ))
          }
        </div>
      </div>
      <div className='container py-12'>
        {
          items.length === 0 ? <p className='text-2xl text-center'>No Items Added For Rent</p> :
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
              {
                items.map(({ item, categoryName, userName, userImage }) => (
                  <Link href={`/items/${item.id}`} key={item.id} className='block border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow'>
                    <div className='group relative overflow-hidden rounded-lg aspect-square'>
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className='object-cover transition-transform duration-500 group-hover:scale-105'
                      />
                    </div>
                    <div>
                      <div className="p-4 ">
                        <h2 className="font-normal truncate text-lg">{item.title}</h2>
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-xs text-slate-400">{formatDistanceToNow(new Date(item.createdAt))}</span>
                          <span className='flex border rounded-xl p-1'>
                            {userImage && userName && (
                           <img
                            className="w-4 h-4 rounded-full text-xs"
                            src={userImage}
                            alt={userName}
                             />
                             )}
                            <span className='text-xs text-gray-500'>{userName}</span></span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              }
            </div>
        }
      </div>

    </div>
  )
}