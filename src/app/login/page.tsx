

import LoginButton from '@/components/auth/login-btn'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { auth } from '@/lib/auth'
import { Home, Icon, PiIcon } from 'lucide-react'
import { headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

const LoginPage = async() => {

    const session = await auth.api.getSession({
        headers : await headers()
    })

    if (session) redirect('/')

  return (
    <div className='flex min-h-screen items-center justify-center bg-slate-50'>
        <Card className='w-full max-w-md shadow'>
            
            <CardHeader className='text-center'>
                
                <CardTitle className='font-2xl'>
                    Welcome back
                </CardTitle>
                <CardDescription className='text-slate-600'>
                    Sign in to your account
                </CardDescription>
                <CardContent >
                    <LoginButton/>
                </CardContent>
                <CardFooter className='flex justify-center'>
                    <Link href={'/'} className='text-sm text-slate-500 hover:text-slate-700 flex gap-2'>
                    Back to <Home className='w-4'/>
                    </Link>
                </CardFooter>

            </CardHeader>
        </Card>
    </div>
  )
}

export default LoginPage