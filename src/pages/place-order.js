import CheckoutWizard from "@/components/CheckoutWizard"
import { useStoreContext } from "@/utils/Store"
import React, { useEffect } from "react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/router"
import axios from "axios"
import { toast } from "react-toastify"
import { getError } from "../utils/error"
import { ACTIONS } from "@/utils/enums"
// import { getCsrfToken } from '@/utils/getCsrfToken';
import OrderDetails from "@/components/OrderDetails"
import { getCsrfToken } from "next-auth/react"

PlaceOrderScreen.title = "Place Order"
PlaceOrderScreen.auth = true
function PlaceOrderScreen() {
   const { state, dispatch } = useStoreContext()
   const { cart } = state
   const { cartItems, shippingAddress, paymentMethod } = cart

   const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100

   const itemsPrice = round2(
      cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
   ) // 123.4567 => 123.46

   const shippingPrice = itemsPrice > 200 ? 0 : 15
   const taxPrice = round2(itemsPrice * 0.15)
   const totalPrice = round2(itemsPrice + shippingPrice + taxPrice)

   const router = useRouter()
   useEffect(() => {
      if (!paymentMethod) {
         router.push("/payment")
      }
   }, [paymentMethod, router])

   const [loading, setLoading] = useState(false)

   const placeOrderHandler = async () => {
      try {
         setLoading(true)

         const { data } = await axios.post("/api/orders", {
            orderItems: cartItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
            csrfToken: await getCsrfToken(),
         })

         setLoading(false)

         router.push(`/order/${data._id}`)
         dispatch({ type: ACTIONS.CART_CLEAR_ITEMS })
      } catch (err) {
         setLoading(false)
         toast.error(getError(err))
      }
   }

   const orderDetails = {
      shippingAddress,
      paymentMethod,
      orderItems: cartItems,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
   }

   return (
      <>
         <CheckoutWizard activeStep={3} />
         <h1 className="mb-4 text-xl">Place Order</h1>
         {cartItems.length === 0 ? (
            <div>
               Cart is empty. <Link href="/">Go shopping</Link>
            </div>
         ) : (
            <OrderDetails
               orderDetails={orderDetails}
               currentPage="place order"
               placeOrderHandler={placeOrderHandler}
               loading={loading}
            />
         )}
      </>
   )
}

export default PlaceOrderScreen
