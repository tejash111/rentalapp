

import { getCategoriesAction, getUserItemAction } from '@/actions/dashboard-actions'
import ItemsGrid from '@/components/dashboard/items-grid'
import UploadItems from '@/components/dashboard/items-upload'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'


const DasboardItem = async() => {

  const session = await auth.api.getSession({
          headers : await headers()
      })

       if (session === null) return null;

  const [categories,assets]=await Promise.all([getCategoriesAction(),getUserItemAction(session?.user.id)])
  
  
 
  return (
    <div className=' container p-6 bg-gradient-to-b from-white via-blue-100 to-white'>
      <div className='flex justify-between items-center mb-6 mt-4 p-4'>
        <h1 className='text-3xl font-medium '>My Items For : Rent</h1>
        
      </div>
      <div className='px-4'>
        <UploadItems categories={categories || []}/>
      </div>
      <ItemsGrid items={assets ??  []} />

    </div>
  )
}

export default DasboardItem