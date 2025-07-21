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
    <div className="w-full min-h-screen bg-gradient-to-b from-white via-blue-100 to-white">
      <div className="container p-12">


        <h1 className="text-3xl">My Orders</h1>
        {
          purchases.length === 0 ?
            <Card className="h-40 mt-4 shadow-sm hover:shadow-lg text-white bg-gradient-to-r from-gray-900 to-gray-800">
              <p className="flex justify-center items-center text-lg font-normal h-full">You haven't Purchased any Item</p>
            </Card>
            :
            <div className="mt-4 space-y-4 ">
              {
                purchases.map(({ purchase, asset }) => (
                  <div key={purchase.id} className="w-full">
                    <Card className="mt-4 shadow-sm hover:shadow-lg p-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between w-full gap-4 sm:gap-0">
                        <div className="flex gap-4 min-w-0 h-24 sm:h-25 items-center">
                          <div className="flex-shrink-0 overflow-hidden rounded">
                            <Image
                              src={asset.image}
                              alt={asset.title}
                              width={90}
                              height={90}
                              className="object-cover w-20 h-20 sm:w-[90px] sm:h-[90px]"
                            />
                          </div>
                          <div className="text-lg sm:text-2xl font-normal truncate max-w-[120px] sm:max-w-none">
                            {asset.title}
                          </div>
                        </div>
                        {/* Middle: Price */}
                        <div className="text-base sm:text-xl font-semibold mx-0 sm:mx-8 whitespace-nowrap mt-2 sm:mt-0">
                          ₹{(purchase.price).toLocaleString()}
                        </div>
                        {/* Right: Delivery Status */}
                        <div className="flex flex-col mt-2 sm:mt-0 sm:mr-25">
                          <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-green-600 inline-block"></span>
                            <span className="font-semibold text-xs sm:text-base">
                              Ordered on {new Date(purchase.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <span className="text-gray-500 text-xs sm:text-sm">Your item will be delivered in an hour</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))
              }
            </div>
        }
      </div>
    </div>
  )
}

export default OrdersPage