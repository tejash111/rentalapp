"use client"

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { Button } from '../ui/button'
import { signOut, useSession } from '@/lib/auth-client'
import { LogOut, Package, PackageCheckIcon, PackagePlus, Settings } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu'
import { toast } from 'sonner'

const Header = () => {
    const pathname=usePathname()
    const router = useRouter()
    const isLoginPage : boolean = pathname === '/login';
    const {data:session,isPending}=useSession()
    const user = session?.user;
    const isAdminUser = user?.role==='admin'

    const isItemPage  : boolean = pathname === '/items';
    const isAsset  : boolean = pathname === '/dashboards/items';
    const isOrders : boolean = pathname === '/dashboards/orders'
    

    const handleLogout =async()=>{
      await signOut({
        fetchOptions : {
          onSuccess : ()=>{
            router.push('/')
            toast.success('logout successfully')
          }
        }
      })
    }

    if (isLoginPage){
        return null;
    }
  return (
    <header className='fixed top-0 right-0 left-0 z-50  md:z-50 border-b bg-white flex '>
      <Link href={'/'} className=' items-center ml-4 md:items-center items-center md:ml-10 flex'>
            <img src="/logo.png" alt="" className='w-50'/>
          </Link>
      <div className='container flex h-16 items-center  px-4 justify-center'>
        <nav className='flex justify-center gap-4 md:gap-16'>
            {
              !isAdminUser && (
                <Link href={'/items'} className='items-center flex justify-center w-full'>
                <Button className='cursor-pointer' variant={isItemPage?'default' : 'ghost'}><Package/><p className='hidden md:block'>Rent Items</p></Button>
                </Link>
              )
            }

            {
              !isPending && user && !isAdminUser &&(
                <>
                <Link href='/dashboards/items'>
                <Button variant={isAsset?'default' : 'ghost'} className='cursor-pointer'><PackagePlus/> <p className='hidden md:block'>Your Assets</p></Button>
                </Link>
                <Link href='/dashboards/orders'>
                <Button className='cursor-pointer' variant={isOrders?'default' : 'ghost'}><PackageCheckIcon/> <p className='hidden md:block'>Orders</p></Button>
                </Link>
                </>
              )
            }

            {
              !isPending && user && isAdminUser &&(
                <>
                <Link href='/admin/asset-approval'>
                <Button variant={'ghost'}>Assets Approval</Button>
                </Link>
                <Link href='/admin/settings'>
                <Button variant={'ghost'}><Settings/> Settings</Button>
                </Link>
                </>
              )
            }
          </nav>

      </div>
      <div className='p-4 mr-4'>
        {
          isPending ? null : user ? 
          
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={'ghost'} className='relative h-8 w-8 rounded-full'>
                <Avatar className='h-8 w-8 border border-slate-300 bg-gray-300'>
                  <AvatarImage src={user?.image?.toString()} alt="image"></AvatarImage>
                  <AvatarFallback>
                    {user?.name ? user?.name.charAt(0).toUpperCase() : 'U'}
                  </AvatarFallback>
                  
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                <div className='flex flex-col space-y-1'><p className='text-sm font-normal'>{user?.name}</p></div>
              </DropdownMenuLabel>
           
              <DropdownMenuItem  onClick={handleLogout} className='flex cursor-pointer hover:bg-gray-100  p-1'>
              <LogOut className='m-1 h-4 w-4 text-gray-600'/>
              <span className='font-light'>Logout</span>
            </DropdownMenuItem>
            </DropdownMenuContent>
           </DropdownMenu>
          
          : <Link href={'/login'}><Button>Login</Button></Link>
        }
      </div>
    </header>
  )
}

export default Header