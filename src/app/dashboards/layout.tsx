import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"



const DashboardLayout = async({
    children
} : {children : React.ReactNode}) => {

    const session=await auth.api.getSession({
        headers:await headers()
    })

    if (!session) redirect('/home')

    if(session && session.user.role==='admin') redirect('/admin/asset-approval')

  return (
    <main className='flex-1 p-4 lg:p-6 mt-12 '>
        {children}
    </main>
  )
}

export default DashboardLayout