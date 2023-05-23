import React from "react"
import { useRouter } from "next/router"

function getRouteString(routeClicked) {
   let route = ""

   if (routeClicked === "User Login") route = ""
   if (routeClicked === "Shipping Address") route = "shipping"
   if (routeClicked === "Payment Method") route = "payment"
   if (routeClicked === "Place Order") route = "placeorder"

   return route
}

function CheckoutWizard({ activeStep = 0 }) {
   const router = useRouter()

   const checkoutSteps = [
      "User Login",
      "Shipping Address",
      "Payment Method",
      "Place Order",
   ]

   return (
      <div className="mb-5 flex flex-wrap">
         {checkoutSteps.map((step, index) => (
            <div
               onClick={() => index < activeStep && router.push(`${getRouteString(step)}`)}
               key={`checkout-wizard-${index}`}
               className={`flex-1 border-b-2 text-center ${index < activeStep && "cursor-pointer"} ${index <= activeStep
                  ? "border-indigo-500 text-indigo-500"
                  : "border-gray-400 text-gray-400"
                  }`}
            >
               {step}
            </div>
         ))}
      </div>
   )
}

export default CheckoutWizard
