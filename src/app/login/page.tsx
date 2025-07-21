

import LoginButton from '@/components/auth/login-btn'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { auth } from '@/lib/auth'
import { ArrowLeft, ChevronLeft, Home, Icon, PiIcon, SkipBack } from 'lucide-react'
import { headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

const LoginPage = async () => {

    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (session) redirect('/')

    return (
        <div className='flex min-h-screen items-center justify-center bg-slate-50'>
            <Card className='w-full max-w-2xl shadow md:m-4 m-2 h-80'>
                <Link href={"/"} className='flex justify-center mt-6'>
                    <img src="/logo.png" alt="Logo" className="h-16 w-auto" />
                </Link>
                <CardHeader className='text-center'>
                    <CardTitle className='text-2xl font-bold'>
                        Welcome back
                    </CardTitle>
                    <CardDescription className='text-slate-600'>
                        Sign in to your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="">
                    <LoginButton />
                </CardContent>
                <CardFooter className='flex justify-center pb-6'>
                    <Link href={'/'} className='text-sm text-slate-500 hover:text-slate-700 flex gap-2 items-center'>
                    <ArrowLeft/>
                        Back to <Home className='w-4' />
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}

export default LoginPage