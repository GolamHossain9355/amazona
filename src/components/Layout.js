import React, { useContext, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { Store } from "../utils/Store"
import { ToastContainer } from "react-toastify"
import { signOut, useSession } from "next-auth/react"
import { Menu } from "@headlessui/react"
import { useRouter } from "next/router"
import { SearchIcon } from "@heroicons/react/outline"

import "react-toastify/dist/ReactToastify.css"
import DropdownLink from "./DropdownLink"
import { ACTIONS } from "@/utils/enums"

function Layout({ children, title, className }) {
   const [query, setQuery] = useState("")
   const router = useRouter()

   const submitHandler = (e) => {
      e.preventDefault()
      router.push(`/search?query=${query}`)
   }

   const { status, data: session } = useSession()
   const {
      state: { cart },
      dispatch,
   } = useContext(Store)

   const logoutHandler = () => {
      dispatch({ type: ACTIONS.CART_RESET })
      signOut({ callbackUrl: "/login" })
   }

   return (
      <>
         <Head>
            <title>{title ? title + " - Amazona" : "Amazona"}</title>
            <meta name="description" content="E-Commerce Website" />
            <link rel="icon" href="/favicon.ico" />
         </Head>

         <ToastContainer
            position="top-center"
            limit={3}
            autoClose={3000}
            closeOnClick
         />

         <div className="flex min-h-screen flex-col justify-between">
            <header>
               <nav className="flex h-12 items-center justify-between px-4 shadow-md">
                  <Link className="text-lg font-bold" href="/">
                     Amazona
                  </Link>

                  <form
                     onSubmit={submitHandler}
                     className="mx-2 hidden w-full items-center justify-center md:flex md:max-w-md lg:max-w-xl"
                  >
                     <input
                        className="rounded-br-none rounded-tr-none text-sm focus:ring-0"
                        onChange={(e) => setQuery(e.target.value)}
                        type="text"
                        placeholder="Search products"
                     />
                     <button
                        className="ml-[-20px] mt-1 h-[37px] rounded rounded-bl-none rounded-tl-none bg-amber-300 p-1 text-sm dark:text-black"
                        type="submit"
                        id="button-addon2"
                     >
                        <SearchIcon className="h-5 w-5"></SearchIcon>
                     </button>
                  </form>

                  <div>
                     <Link className="p-2" href="/cart">
                        Cart{" "}
                        {cart?.cartItems?.length > 0 && (
                           <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                              {cart.cartItems.reduce(
                                 (accumulator, item) =>
                                    accumulator + item.quantity,
                                 0
                              )}
                           </span>
                        )}
                     </Link>

                     {status === "loading" ? (
                        "Loading..."
                     ) : session?.user ? (
                        <Menu
                           as="div"
                           className="relative inline-block text-left"
                        >
                           <Menu.Button className="text-blue-600">
                              {session.user.name}
                           </Menu.Button>

                           <Menu.Items className="absolute right-0 w-56 origin-top-right bg-white shadow-lg">
                              <Menu.Item>
                                 <DropdownLink
                                    className="dropdown-link"
                                    href="/profile"
                                 >
                                    Profile
                                 </DropdownLink>
                              </Menu.Item>
                              <Menu.Item>
                                 <DropdownLink
                                    className="dropdown-link"
                                    href="/order-history"
                                 >
                                    Order History
                                 </DropdownLink>
                              </Menu.Item>
                              {session.user.isAdmin && (
                                 <Menu.Item>
                                    <DropdownLink
                                       className="dropdown-link"
                                       href="/admin/dashboard"
                                    >
                                       Admin Dashboard
                                    </DropdownLink>
                                 </Menu.Item>
                              )}
                              <Menu.Item>
                                 <a
                                    className="dropdown-link"
                                    href="#"
                                    onClick={logoutHandler}
                                 >
                                    Logout
                                 </a>
                              </Menu.Item>
                           </Menu.Items>
                        </Menu>
                     ) : (
                        <Link className="p-2" href="/login">
                           Login
                        </Link>
                     )}
                  </div>
               </nav>
            </header>

            <main className={`container m-auto mt-4 px-4 ${className}`}>
               {children}
            </main>

            <footer className="flex h-10 items-center justify-center shadow-inner">
               <p>Copyright © 2022 Amazona</p>
            </footer>
         </div>
      </>
   )
}

export default Layout
