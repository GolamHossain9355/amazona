import { useState, useEffect } from "react"
import CheckoutWizard from "@/components/CheckoutWizard"
import { useRouter } from "next/router"
import { useStoreContext } from "@/utils/Store"
import { toast } from "react-toastify"
import { ACTIONS } from "@/utils/enums"
import PageHeading from '../components/PageHeading';

PaymentScreen.title = "Payment Method"
PaymentScreen.auth = true
function PaymentScreen() {
   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")
   const router = useRouter()
   const { state, dispatch } = useStoreContext()
   const { cart } = state
   const { paymentMethod, shippingAddress } = cart

   useEffect(() => {
      const storedAddress = JSON.parse(sessionStorage.getItem("cart")).cart.shippingAddress.address
      if (!storedAddress) {
         router.push("/shipping")
         return
      }

      setSelectedPaymentMethod(paymentMethod || "")
   }, [paymentMethod, router, shippingAddress])

   const submitHandler = (e) => {
      e.preventDefault()
      if (!selectedPaymentMethod) {
         toast.error("Payment method is required")
         return
      }

      dispatch({ type: ACTIONS.SAVE_PAYMENT_METHOD, payload: selectedPaymentMethod })
      router.push("/place-order")
   }

   const paymentMethods = ["PayPal", "Stripe", "CashOnDelivery"]

   return (
      <>
         <CheckoutWizard activeStep={2} />
         <form className="mx-auto max-w-screen-md" onSubmit={submitHandler}>
            <PageHeading className="font-bold">Payment Method</PageHeading>

            {paymentMethods.map((payment) => (
               <div key={payment} className="mb-4 flex justify-start items-center gap-2">
                  <input
                     name="paymentMethod"
                     className="p-4 outline-none focus:ring-0 active:ring-0"
                     id={payment}
                     type="radio"
                     checked={selectedPaymentMethod === payment}
                     onChange={() => setSelectedPaymentMethod(payment)}
                  />

                  <label className="p-1 text-lg" htmlFor={payment}>
                     {payment}
                  </label>
               </div>
            ))}

            <div className="mt-5 mx-auto flex justify-between w-1/2 min-w-fit">
               <button
                  onClick={() => router.push('/shipping')}
                  type="button"
                  className="custom-button-gray"
               >
                  Back
               </button>
               <button className="custom-button">Next</button>
            </div>
         </form>
      </>
   );
}

export default PaymentScreen
