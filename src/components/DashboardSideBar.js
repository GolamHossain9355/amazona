import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"

export default function DashboardSideBar({ className, ...rest }) {
   const { pathname } = useRouter()

   return (
      <div className={`card ${className}`} {...rest}>
         <ul className="flex h-fit flex-col items-center justify-center">
            <li
               className={`w-full cursor-pointer rounded-t-lg p-3 text-center transition-all ${
                  pathname === "/admin/dashboard" && "bg-gray-200"
               } hover:bg-gray-200`}
            >
               <Link className="font-bold" href="/admin/dashboard">
                  Dashboard
               </Link>
            </li>
            <li
               className={`w-full cursor-pointer rounded-sm p-3 text-center transition-all ${
                  pathname === "/admin/orders" && "bg-gray-200"
               } hover:bg-gray-200`}
            >
               <Link href="/admin/orders">Orders</Link>
            </li>
            <li
               className={`w-full cursor-pointer rounded-sm  p-3 text-center transition-all ${
                  pathname === "/admin/products" && "bg-gray-200"
               } hover:bg-gray-200`}
            >
               <Link href="/admin/products">Products</Link>
            </li>
            <li
               className={`w-full cursor-pointer rounded-b-lg p-3 text-center transition-all ${
                  pathname === "/admin/users" && "bg-gray-200"
               } hover:bg-gray-200`}
            >
               <Link href="/admin/users">Users</Link>
            </li>
         </ul>
      </div>
   )
}
