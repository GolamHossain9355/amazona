import OrderDetails from "@/components/OrderDetails"
import PageHeading from "@/components/PageHeading"
import { getError } from "@/utils/error"
import { getCsrfToken } from "@/utils/getCsrfToken"
import { usePayPalScriptReducer } from "@paypal/react-paypal-js"
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

      case "PAY_REQUEST":
         return { ...state, loadingPay: true }

      case "PAY_SUCCESS":
         return { ...state, loadingPay: false, successPay: true }

      case "PAY_FAIL":
         return { ...state, loadingPay: false, errorPay: action.payload }

      case "PAY_RESET":
         return { ...state, loadingPay: false, successPay: false, errorPay: "" }

      case "DELIVER_REQUEST":
         return { ...state, loadingDeliver: true }

      case "DELIVER_SUCCESS":
         return { ...state, loadingDeliver: false, successDeliver: true }

      case "DELIVER_FAIL":
         return { ...state, loadingDeliver: false }

      case "DELIVER_RESET":
         return {
            ...state,
            loadingDeliver: false,
            successDeliver: false,
         }

      default:
         return state
   }
}

OrderScreen.title = "Orders"
OrderScreen.auth = true
function OrderScreen() {
   const { query } = useRouter()
   const orderID = query._id

   const [{ isPending }, paypalDispatch] = usePayPalScriptReducer()

   const [
      {
         loading,
         error,
         order,
         successPay,
         loadingPay,
         loadingDeliver,
         successDeliver,
      },
      dispatch,
   ] = useReducer(reducer, {
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
            dispatch({ type: "FETCH_FAIL", payload: getError(error) })
            console.error(error)
            toast.error("Error fetching order data")
         }
      }

      if (
         !order._id ||
         successPay ||
         successDeliver ||
         (order._id && order._id !== orderID)
      ) {
         fetchOrder()

         if (successPay) dispatch({ type: "PAY_RESET" })
         if (successDeliver) {
            dispatch({ type: "DELIVER_RESET" })
         }
      } else {
         const loadPaypalScript = async () => {
            const { data: clientID } = await axios.get("/api/keys/paypal")

            paypalDispatch({
               type: "resetOptions",
               value: {
                  "client-id": clientID,
                  currency: "USD",
               },
            })

            paypalDispatch({
               type: "setLoadingStatus",
               value: "pending",
            })
         }
         loadPaypalScript()
      }
   }, [order, orderID, paypalDispatch, successDeliver, successPay])

   const createOrder = (data, actions) => {
      return actions.order
         .create({
            purchase_units: [
               {
                  amount: { value: order.totalPrice },
               },
            ],
         })
         .then((orderID) => {
            return orderID
         })
   }

   const onApprove = (data, actions) => {
      return actions.order.capture().then(async (details) => {
         try {
            dispatch({ type: "PAY_REQUEST" })
            const { data } = await axios.put(`/api/orders/${order._id}/pay`, {
               ...details,
               csrfToken: await getCsrfToken(),
            })
            dispatch({ type: "PAY_SUCCESS", payload: data })
            toast.success("Order is paid successfully")
         } catch (err) {
            dispatch({ type: "PAY_FAIL", payload: getError(err) })
            toast.error(getError(err))
         }
      })
   }

   async function deliverOrderHandler() {
      try {
         dispatch({ type: "DELIVER_REQUEST" })
         const { data } = await axios.put(
            `/api/admin/orders/${order._id}/deliver`,
            {
               csrfToken: await getCsrfToken(),
            }
         )
         dispatch({ type: "DELIVER_SUCCESS", payload: data })
         toast.success("Order is delivered")
      } catch (err) {
         dispatch({ type: "DELIVER_FAIL", payload: getError(err) })
         toast.error(getError(err))
      }
   }

   const onError = (err) => {
      toast.error(getError(err))
   }

   return (
      <>
         <PageHeading>Order {orderID}</PageHeading>
         {loading ? (
            <div>Loading...</div>
         ) : error ? (
            <div className="alert-error">{error}</div>
         ) : (
            <OrderDetails
               orderDetails={order}
               currentPage="order"
               createOrder={createOrder}
               onApprove={onApprove}
               onError={onError}
               isPending={isPending}
               loadingPay={loadingPay}
               loadingDeliver={loadingDeliver}
               deliverOrderHandler={deliverOrderHandler}
            />
         )}
      </>
   )
}

export default OrderScreen
