import { useEffect } from "react"
import Layout from "@/components/Layout"
import CheckoutWizard from "./../components/CheckoutWizard"
import { useForm } from "react-hook-form"
import { CartActions } from "@/utils/enums"
import { useStoreContext } from "../utils/Store"
import { useRouter } from "next/router"

function ShippingScreen() {
   const router = useRouter()
   const {
      handleSubmit,
      setValue,
      register,
      formState: { errors },
   } = useForm()
   const {
      state: {
         cart: { shippingAddress },
      },
      dispatch,
   } = useStoreContext()

   useEffect(() => {
      if (!shippingAddress) return

      setValue("fullName", shippingAddress.fullName)
      setValue("address", shippingAddress.address)
      setValue("city", shippingAddress.city)
      setValue("postalCode", shippingAddress.postalCode)
      setValue("country", shippingAddress.country)
   }, [shippingAddress, setValue])

   const submitHandler = ({ fullName, address, city, country, postalCode }) => {
      dispatch({
         type: CartActions.SAVE_SHIPPING_ADDRESS,
         payload: { fullName, address, city, country, postalCode },
      })

      router.push("/payment")
   }

   return (
      <Layout title="Shipping Address">
         <CheckoutWizard activeStep={1} />

         <form
            className="mx-auto max-w-screen-md"
            onSubmit={handleSubmit(submitHandler)}
         >
            <h1 className="mb-4 text-xl">Shipping Address</h1>

            <div className="mb-4">
               <label htmlFor="fullName">Full Name</label>
               <input
                  className="w-full"
                  type="text"
                  placeholder="Enter full name"
                  autoFocus
                  id="fullName"
                  {...register("fullName", {
                     required: "Please enter full name",
                  })}
               />
               {errors.fullName && (
                  <p className="text-red-600">{errors.fullName.message}</p>
               )}
            </div>

            <div className="mb-4">
               <label htmlFor="address">Address</label>
               <input
                  className="w-full"
                  type="text"
                  placeholder="Enter street address"
                  autoFocus
                  id="address"
                  {...register("address", {
                     required: "Please enter address",
                     minLength: {
                        value: 3,
                        message: "Address is more than 2 characters",
                     },
                  })}
               />
               {errors.address && (
                  <p className="text-red-600">{errors.address.message}</p>
               )}
            </div>

            <div className="mb-4">
               <label htmlFor="city">City</label>
               <input
                  className="w-full"
                  type="text"
                  placeholder="Enter city"
                  autoFocus
                  id="city"
                  {...register("city", {
                     required: "Please enter city",
                  })}
               />
               {errors.city && (
                  <p className="text-red-600">{errors.city.message}</p>
               )}
            </div>

            <div className="mb-4">
               <label htmlFor="postalCode">Postal Code</label>
               <input
                  className="w-full"
                  type="text"
                  placeholder="Enter postalCode"
                  autoFocus
                  id="postalCode"
                  {...register("postalCode", {
                     required: "Please enter postalCode",
                  })}
               />
               {errors.postalCode && (
                  <p className="text-red-600">{errors.postalCode.message}</p>
               )}
            </div>

            <div className="mb-4">
               <label htmlFor="country">Country</label>
               <input
                  className="w-full"
                  type="text"
                  placeholder="Enter country"
                  autoFocus
                  id="country"
                  {...register("country", {
                     required: "Please enter country",
                  })}
               />
               {errors.country && (
                  <p className="text-red-600">{errors.country.message}</p>
               )}
            </div>

            <div className="mb-4 flex w-full flex-col items-center justify-center">
               <button className="custom-button">Next</button>
            </div>
         </form>
      </Layout>
   )
}

ShippingScreen.auth = true

export default ShippingScreen
