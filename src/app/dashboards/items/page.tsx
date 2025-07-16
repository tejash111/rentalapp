

import { getCategoriesAction } from '@/actions/dashboard-actions'
import ItemsGrid from '@/components/dashboard/items-grid'
import UploadItems from '@/components/dashboard/items-upload'


const DasboardItem = async() => {

  const [categories]=await Promise.all([getCategoriesAction()])
  return (
    <div className='container py-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-medium '>My Items For : Rent</h1>
        
      </div>
      <div>
        <UploadItems categories={categories || []}/>
      </div>
      <ItemsGrid/>
    </div>
  )
}

export default DasboardItem