import { getItemByIdAction } from "@/actions/dashboard-actions"
import { createPaypalOrderAction } from "@/actions/payment-actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { auth } from "@/lib/auth"
import { username } from "better-auth/plugins"
import {  Info, Loader2, Map, MapPin, ShoppingCart, Tag } from "lucide-react"
import { headers } from "next/headers"
import Image from "next/image"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { Suspense } from "react"

interface PageProps {
  params: Promise<{
    id: string
  }>,
  searchParams?: Promise<{
    success?: string;
    canceled?: string;
    error?: string;
  }>
}

const ItemDetailsPage = async ({ params, searchParams }: PageProps) => {
  return (
    <div className='mt-7 md:mt-20 p-4 bg-gradient-to-b from-white via-blue-100 to-white min-h-screen'>
      <Suspense
        fallback={
          <div className='flex items-center justify-center min-h-[65vh]'>
            <Loader2 className='h-8 w-8 animate-spin text-black' />
          </div>
        }
      >
        <ItemContentPage params={params} searchParams={searchParams}/>
      </Suspense>
    </div>
  )
}

export default ItemDetailsPage


const ItemContentPage = async ({ params, searchParams }: PageProps) => {
  // Await the params Promise
  const resolvedParams = await params
  const resolvedSearchParams = searchParams ? await searchParams : undefined

  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session && session?.user?.role === 'admin') {
    redirect('/')
  }
  
  const result = await getItemByIdAction(resolvedParams.id)

  if (!result) {
    notFound()
  }

  const { item, categoryName, userName, userId, userImage } = result
  console.log(item.price);
  

  const isAuthor = session?.user.id === userId

  const handlePurchase = async()=>{
    "use server"

    const result = await createPaypalOrderAction(resolvedParams.id)
    if (result?.approvalLink){
      redirect(result.approvalLink)
    }
  }


  return (
    <div className="min-h-screen container px-4 bg-white bg-gradient-to-b from-white via-blue-100 to-white">
      <div className="container py-12">
        <div className="grid gap-12 md:grid-cols-2">
          <div className="md:col-span-1 space-y-8">
            <div className="rounded-lg overflow-hidden bg-gray-100 border">
              <div className="relative w-full">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <Card className=" overflow-hidden border-0 p-0 shadow-lg">
              <div className=" p-5 space-y-4 text-white bg-gradient-to-r from-gray-900 to-gray-800 ">
            <div className="flex items-center justify-between">
              <div >
                <h1 className="text-3xl font-normal">{item.title.toUpperCase()}</h1>
              </div>
              <div>
                <span className='flex shadow-sm shadow-black rounded-xl p-1 gap-2'>
                  <span className="text-xs">Added By : </span>
                  {userImage && userName && (
                    <img
                      className="w-4 h-4 rounded-full text-xs"
                      src={userImage}
                      alt={userName}
                    />
                  )}
                  <span className='text-xs text-gray-200'>{userName}</span></span>
              </div>
            </div>
            <div className="text-sm text-gray-300 flex"><MapPin className=" text-gray-300 h-4 w-4 mt-1"/>{item.location}</div>
            <div className="text-3xl ">₹{item.pricePerDay}</div>
            <div  className="text-sm font-light text-gray-300">
              {item.description}
            </div>
          </div>
          <CardContent>
            {
              session?.user ? 
              isAuthor? <div className="bg-blue-50 p-2 mb-6 rounded-lg flex items-start gap-3">
                <Info className="w-4 h-4 mt-1 flex-shrink-0 text-blue-700"/>
                <p className="text-blue-700 text-sm">This is your Item. You can't Purchase your own Item</p>
              </div> : 
              <>
              <form action={handlePurchase} className="mb-6 ">
                <Button  type="submit" className="w-full cursor-pointer">
                  <ShoppingCart className="mr-2 w-4 h-4"/>
                  Rent Now
                </Button>
              </form>
              {
                 item.price !==0 && (
                  <div className="">
                    <div className="flex items-center my-4">
          <hr className="flex-grow border-t border-gray-300" />
  <span className="mx-4 text-gray-500">or</span>
  <hr className="flex-grow border-t border-gray-300" />
</div>
                    <Button  className="w-full mb-6 cursor-pointer">Buy for ₹{item.price} </Button>
                  </div>
                )
              }
              </>
              : <>
              <Button className="w-full justify-center items-center flex mb-6 cursor-pointer">
               <Link href={'/login'}>
               Sign In to Rent
               </Link>
                
              </Button>
              </>
              
            }
          </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}