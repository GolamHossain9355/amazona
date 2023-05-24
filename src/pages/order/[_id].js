import OrderDetails from "@/components/OrderDetails"
import PageHeading from "@/components/PageHeading"
import { getError } from "@/utils/error"
import axios from "axios"
import { useRouter } from "next/router"
import React, { useEffect, useReducer } from "react"
import { toast } from "react-toastify"

function reducer(state, action) {
   switch (action.type) {
      case "FETCH_REQUEST":
         return { ...state, loading: true, error: "" }

      case "FETCH_SUCCESS":
         return { ...state, loading: false, order: action.payload, error: "" }

      case "FETCH_FAIL":
         return { ...state, loading: false, error: action.payload }

      default:
         return state
   }
}

OrderScreen.title = "Orders"
OrderScreen.auth = true
function OrderScreen() {
   const { query } = useRouter()
   const orderID = query._id

   const [{ loading, error, order }, dispatch] = useReducer(reducer, {
      loading: true,
      order: {},
      error: "",
   })

   useEffect(() => {
      const fetchOrder = async () => {
         try {
            dispatch({ type: "FETCH_REQUEST" })
            const { data } = await axios.get(`/api/orders/${orderID}`)
            dispatch({ type: "FETCH_SUCCESS", payload: data })
         } catch (error) {
            console.error(error)
            toast.error("Error fetching order data")
            dispatch({ type: "FETCH_FAIL", payload: getError(error) })
         }
      }

      if (!order._id || (order._id && order._id !== orderID)) {
         fetchOrder()
      }
   }, [order, orderID])

   return (
      <>
         <PageHeading>Order {orderID}</PageHeading>
         {loading ? (
            <div>Loading...</div>
         ) : error ? (
            <div className="alert-error">{error}</div>
         ) : (
            <OrderDetails orderDetails={order} currentPage="order" />
         )}
      </>
   )
}

export default OrderScreen
