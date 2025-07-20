import Image from "next/image";
import { Badge } from "../ui/badge";
import {formatDistanceToNow} from "date-fns"

type Item = {
   id: string;
  title: string;
  description: string | null;
  image: string;
  location: string | null;
  isApproved: string;
  userId: string;
  categoryId: number | null;
  createdAt: Date;
  updatedAt: Date;
  isAvailable: boolean | null;
  availableFrom: Date | null;
  availableTo: Date | null;
  pricePerDay: number | null;
  price : number | null;
}


interface ItemGridProps {
  items : Item[];
}

const ItemsGrid = ({items} : ItemGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
      {
        items.map(item=>(
          <div key={item.id} className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow ">
            <div className="h-48 bg-slate-100 relative text-white bg-gradient-to-r from-gray-900 to-gray-800">
              <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover rounded-b-xl "
              />
              <div className="absolute top-2 right-2 ">
                <Badge className={ 
                  item.isApproved === 'approved' ? "bg-green-600" : item.isApproved ==='rejected'? "bg-red-600" : "bg-yellow-500"
                } variant={'default'}>
                  <div className="font-normal">
                  {
                    item.isApproved === 'approved' ? "Approved":item.isApproved === "rejected" ? "Rejected" : "Pending"
                  }
                  </div>
                  
                </Badge>
              </div>
            </div>
            <div className="p-4 text-white bg-gradient-to-r from-gray-900 to-gray-800">
                  <div className="flex justify-between">
                  <h2 className="font-normal truncate text-lg">{item.title}</h2>
                  <h2 className="font-normal truncate text-xl">₹{item.pricePerDay}</h2>
                  </div>
                  {
                    item.description && (
                      <p className="text-xs text-slate-500">{item.description}</p>
                    )
                  }
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-slate-400">{formatDistanceToNow(new Date(item.createdAt))}</span>
                  </div>
            </div>
          </div>

        ))
      }
    </div>
  )
}

export default ItemsGrid