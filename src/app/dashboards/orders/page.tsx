import { getUsersInvoicesAction } from "@/actions/invoice-actions"
import { getAllUserPurchasedItemAction } from "@/actions/payment-actions"
import { Card } from "@/components/ui/card"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import Image from "next/image"
import { redirect } from "next/navigation"




const OrdersPage = async () => {

  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session?.user) {
    redirect('/login')
  }

  if (session?.user?.role === 'admin') {
    redirect('/')
  }

  const purchaseResult = await getAllUserPurchasedItemAction()

  const invoicesResult = await getUsersInvoicesAction()

  const purchases = Array.isArray(purchaseResult) ? purchaseResult : []
  const invoices = invoicesResult.success && invoicesResult.invoices ?
    invoicesResult.invoices
    : [];

  const purchaseToInvoiceMap = new Map();
  invoices.forEach((inv) => purchaseToInvoiceMap.set(inv.purchaseId, inv.id))

  return (
   <div className="container p-8">
    <h1 className="text-3xl">My Orders</h1>
    {
      purchases.length !== 0 ? 
      <Card className="h-40 mt-4 shadow-sm hover:shadow-lg">
        <p className="flex justify-center items-center text-lg font-normal h-full">You haven't Purchased any Item</p>
      </Card>
      :
      <div className="mt-4 space-y-4 ">
        {
          purchases.map(({purchase,asset})=>(
            <div key={purchase.id} className="">
              <Card>
                <div><Image
                src={asset.image}
                alt={asset.title}
                fill
                /></div>
              </Card>
            </div>
          ))
        }
      </div>
    }
   </div>
  )
}

export default OrdersPage