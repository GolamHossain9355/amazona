import { useContext } from "react"
import { Store } from "../utils/Store"
import Layout from "@/components/Layout"
import Link from "next/link"
import Image from "next/image"
import { CartActions } from "../utils/enums"
import { useRouter } from "next/router"

import { XCircleIcon } from "@heroicons/react/solid"

function Cart() {
   const router = useRouter()
   const {
      state: {
         cart: { cartItems },
      },
      dispatch,
   } = useContext(Store)

   const removeItemHandler = (item) => {
      dispatch({ type: CartActions.CART_REMOVE_ITEM, payload: item })
   }

   const updateQuantityHandler = (item, quantity) => {
      dispatch({
         type: CartActions.CART_ADD_ITEM,
         payload: { ...item, quantity },
      })
   }

   return (
      <Layout title="Shopping Cart">
         <h1 className="mb-4 text-xl">Shopping Cart</h1>

         {cartItems.length === 0 ? (
            <div>
               Cart is empty. <Link href="/">Go shopping</Link>
            </div>
         ) : (
            <div className="grid md:grid-cols-4 md:gap-5">
               <div className="overflow-x-auto md:col-span-3">
                  <table className="min-w-full">
                     <thead className="border-b">
                        <tr className="text-center">
                           <th className="px-5">Item</th>
                           <th className="p-5">Quantity</th>
                           <th className="p-5">Price</th>
                           <th className="p-5">Action</th>
                        </tr>
                     </thead>

                     <tbody className="text-center">
                        {cartItems.map((item) => (
                           <tr key={item.slug} className="border-b text-center">
                              <td className="p-5">
                                 <Link
                                    className="flex justify-center"
                                    href={`/product/${item.slug}`}
                                 >
                                    <Image
                                       src={item.image}
                                       alt={item.name}
                                       width={50}
                                       height={50}
                                    />
                                 </Link>
                              </td>

                              <td>
                                 <select
                                    value={item.quantity}
                                    className="cursor-pointer"
                                    onChange={(e) =>
                                       updateQuantityHandler(
                                          item,
                                          Number(e.target.value)
                                       )
                                    }
                                 >
                                    {[...Array(item.countInStock).keys()].map(
                                       (num) => (
                                          <option
                                             key={`cart item quantity ${num}`}
                                             value={num + 1}
                                          >
                                             {num + 1}
                                          </option>
                                       )
                                    )}
                                 </select>
                              </td>

                              <td className="p-5">${item.price}</td>

                              <td className="p-5">
                                 <button
                                    onClick={() => removeItemHandler(item)}
                                    className="relative max-w-xs overflow-hidden rounded-full bg-red-200 bg-cover bg-no-repeat p-1 text-red-600"
                                    type="button"
                                 >
                                    <XCircleIcon className="h-5 w-5 max-w-xs transition duration-300 ease-in-out hover:scale-150 active:scale-90"></XCircleIcon>
                                 </button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>

               <div className="card p-5">
                  <ul>
                     <li>
                        <div className="pb-3 text-xl">
                           Subtotal (
                           {cartItems.reduce((a, c) => a + c.quantity, 0)}) : $
                           {cartItems.reduce(
                              (a, c) => a + c.quantity * c.price,
                              0
                           )}
                        </div>
                     </li>

                     <li>
                        <button
                           className="primary-button w-full"
                           type="button"
                           onClick={() =>
                              router.push("login?redirect=shipping")
                           }
                        >
                           Checkout
                        </button>
                     </li>
                  </ul>
               </div>
            </div>
         )}
      </Layout>
   )
}

export default Cart
