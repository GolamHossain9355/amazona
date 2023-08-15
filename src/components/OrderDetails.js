import Image from "next/image"
import Link from "next/link"
import React from "react"
import PageHeading from "./PageHeading"
import { PayPalButtons } from "@paypal/react-paypal-js"
import { useSession } from "next-auth/react"

const getFormattedDate = (dateString) =>
   new Intl.DateTimeFormat("en-us", {
      dateStyle: "full",
      timeStyle: "long",
   }).format(new Date(dateString))

function OrderDetails({
   orderDetails,
   currentPage = "place order",
   placeOrderHandler,
   loading,
   createOrder,
   onError,
   onApprove,
   isPending,
   loadingPay,
   loadingDeliver,
   deliverOrderHandler,
}) {
   const {
      shippingAddress,
      paymentMethod,
      orderItems,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid,
      paidAt,
      isDelivered,
      deliveredAt,
   } = orderDetails

   const { data: session } = useSession()

   return (
      <div className="grid lg:grid-cols-4 lg:gap-5">
         <div className="overflow-x-auto lg:col-span-3">
            <div className="card  p-5">
               <PageHeading>Shipping Address</PageHeading>
               <div>
                  {shippingAddress.fullName}, {shippingAddress.address},{" "}
                  {shippingAddress.city}, {shippingAddress.postalCode},{" "}
                  {shippingAddress.country}
               </div>
               {currentPage === "order" ? (
                  isDelivered ? (
                     <div className="alert-success">
                        Delivered at {deliveredAt}
                     </div>
                  ) : (
                     <div className="alert-error">Not delivered</div>
                  )
               ) : (
                  <div>
                     <Link href="/shipping">Edit</Link>
                  </div>
               )}
            </div>

            <div className="card p-5">
               <PageHeading>Payment Method</PageHeading>
               <div>{paymentMethod}</div>
               {currentPage === "order" ? (
                  isPaid ? (
                     <div className="alert-success">
                        Paid at {getFormattedDate(paidAt)}
                     </div>
                  ) : (
                     <div className="alert-error">Not paid</div>
                  )
               ) : (
                  <div>
                     <Link href="/payment">Edit</Link>
                  </div>
               )}
            </div>

            <div className="card  p-5">
               <PageHeading>Order Items</PageHeading>
               <table className="min-w-full">
                  <thead className="border-b">
                     <tr>
                        <th className="px-5 text-left">Item</th>
                        <th className="p-5 text-right">Quantity</th>
                        <th className="p-5 text-right">Price</th>
                        <th className="p-5 text-right">Subtotal</th>
                     </tr>
                  </thead>
                  <tbody>
                     {orderItems.map((item) => (
                        <tr key={item._id} className="border-b">
                           <td>
                              <Link
                                 className="flex items-center"
                                 href={`/product/${item.slug}`}
                              >
                                 <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={50}
                                    height={50}
                                 ></Image>
                                 &nbsp;
                                 {item.name}
                              </Link>
                           </td>
                           <td className=" p-5 text-right">{item.quantity}</td>
                           <td className="p-5 text-right">${item.price}</td>
                           <td className="p-5 text-right">
                              ${item.quantity * item.price}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
         <div>
            <div className="card  p-5">
               <h2 className="mb-2 text-lg">Order Summary</h2>
               <ul>
                  <li>
                     <div className="mb-2 flex justify-between">
                        <div>Items</div>
                        <div>${itemsPrice}</div>
                     </div>
                  </li>{" "}
                  <li>
                     <div className="mb-2 flex justify-between">
                        <div>Tax</div>
                        <div>${taxPrice}</div>
                     </div>
                  </li>
                  <li>
                     <div className="mb-2 flex justify-between">
                        <div>Shipping</div>
                        <div>${shippingPrice}</div>
                     </div>
                  </li>
                  <li>
                     <div className="mb-2 flex justify-between">
                        <div>Total</div>
                        <div>${totalPrice}</div>
                     </div>
                  </li>
                  {currentPage === "place order" ? (
                     <li>
                        <button
                           disabled={loading}
                           onClick={placeOrderHandler}
                           className="primary-button w-full"
                        >
                           {loading ? "Loading..." : "Place Order"}
                        </button>
                     </li>
                  ) : !isPaid ? (
                     <li>
                        {isPending ? (
                           <div>Loading...</div>
                        ) : (
                           <div className="relative w-full">
                              <PayPalButtons
                                 createOrder={createOrder}
                                 onApprove={onApprove}
                                 onError={onError}
                              />
                           </div>
                        )}

                        {loadingPay ? <div>Loading...</div> : null}
                     </li>
                  ) : null}
                  {session.user.isAdmin && isPaid && !isDelivered && (
                     <li>
                        {loadingDeliver && <div>Loading...</div>}
                        <button
                           className="primary-button lg:text-md w-full text-sm"
                           onClick={deliverOrderHandler}
                        >
                           Deliver Order
                        </button>
                     </li>
                  )}
               </ul>
            </div>
         </div>
      </div>
   )
}

export default OrderDetails
