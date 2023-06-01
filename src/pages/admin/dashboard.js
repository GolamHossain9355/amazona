import axios from "axios"
import Link from "next/link"
import { Bar } from "react-chartjs-2"

import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   BarElement,
   Title,
   Tooltip,
   Legend,
} from "chart.js"
import React, { useEffect, useReducer } from "react"
import { getError } from "../../utils/error"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export const options = {
   responsive: true,
   plugins: {
      legend: {
         position: "top",
      },
   },
}

function reducer(state, action) {
   switch (action.type) {
      case "FETCH_REQUEST":
         return { ...state, loading: true, error: "" }

      case "FETCH_SUCCESS":
         return { ...state, loading: false, summary: action.payload, error: "" }

      case "FETCH_FAIL":
         return { ...state, loading: false, error: action.payload }

      default:
         state
   }
}

AdminDashboardScreen.title = "Admin Dashboard"
AdminDashboardScreen.auth = { adminOnly: true }
function AdminDashboardScreen() {
   const [{ loading, error, summary }, dispatch] = useReducer(reducer, {
      loading: true,
      summary: { salesData: [] },
      error: "",
   })

   useEffect(() => {
      const fetchData = async () => {
         try {
            dispatch({ type: "FETCH_REQUEST" })
            const { data } = await axios.get(`/api/admin/summary`)
            dispatch({ type: "FETCH_SUCCESS", payload: data })
         } catch (err) {
            dispatch({ type: "FETCH_FAIL", payload: getError(err) })
         }
      }

      fetchData()
   }, [])

   const data = {
      labels: summary.salesData.map((x) => x._id), // 2022/01 2022/03
      datasets: [
         {
            label: "Sales",
            backgroundColor: "rgba(162, 222, 208, 1)",
            data: summary.salesData.map((x) => x.totalSales),
         },
      ],
   }
   return (
      <div className="grid md:grid-cols-4 md:gap-5">
         <div className="card">
            <ul className="flex h-fit flex-col items-center justify-center">
               <li className="w-full rounded-t-lg p-3 text-center transition-all hover:bg-gray-200">
                  <Link className="font-bold" href="/admin/dashboard">
                     Dashboard
                  </Link>
               </li>
               <li className="w-full rounded-sm p-3 text-center transition-all hover:bg-gray-200">
                  <Link href="">Orders</Link>
               </li>
               <li className="w-full rounded-sm  p-3 text-center transition-all hover:bg-gray-200">
                  <Link href="">Products</Link>
               </li>
               <li className="w-full rounded-b-lg p-3 text-center transition-all hover:bg-gray-200">
                  <Link href="">Users</Link>
               </li>
            </ul>
         </div>
         <div className="md:col-span-3">
            <h1 className="mb-4 text-center text-xl md:text-left">
               Admin Dashboard
            </h1>
            {loading ? (
               <div>Loading...</div>
            ) : error ? (
               <div className="alert-error">{error}</div>
            ) : (
               <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                     <div className="card m-5 p-5">
                        <p className="text-3xl">${summary.ordersPrice} </p>
                        <p>Sales</p>
                        <Link href="/admin/orders">View sales</Link>
                     </div>
                     <div className="card m-5 p-5">
                        <p className="text-3xl">{summary.ordersCount} </p>
                        <p>Orders</p>
                        <Link href="/admin/orders">View orders</Link>
                     </div>
                     <div className="card m-5 p-5">
                        <p className="text-3xl">{summary.productsCount} </p>
                        <p>Products</p>
                        <Link href="/admin/products">View products</Link>
                     </div>
                     <div className="card m-5 p-5">
                        <p className="text-3xl">{summary.usersCount} </p>
                        <p>Users</p>
                        <Link href="/admin/users">View users</Link>
                     </div>
                  </div>
                  <h2 className="text-xl">Sales Report</h2>
                  <Bar
                     options={{
                        legend: { display: true, position: "right" },
                     }}
                     data={data}
                  />
               </div>
            )}
         </div>
      </div>
   )
}

export default AdminDashboardScreen
