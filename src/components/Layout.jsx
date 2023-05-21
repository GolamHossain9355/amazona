import React, { useContext } from "react"
import Head from "next/head"
import Link from "next/link"
import { Store } from "./../utils/Store"
import { ToastContainer } from "react-toastify"
import { useSession } from "next-auth/react"

import "react-toastify/dist/ReactToastify.css"

function Layout({ children, title }) {
   const { status, data: session } = useSession()
   const {
      state: { cart },
   } = useContext(Store)

   return (
      <>
         <Head>
            <title>{title ? title + " - Amazona" : "Amazona"}</title>
            <meta name="description" content="E-Commerce Website" />
            <link rel="icon" href="/favicon.ico" />
         </Head>

         <ToastContainer position="bottom-center" limit={1} />

         <div className="flex min-h-screen flex-col justify-between">
            <header>
               <nav className="flex h-12 items-center justify-between px-4 shadow-md">
                  <Link className="text-lg font-bold" href="/">
                     Amazona
                  </Link>

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
                        session.user.name
                     ) : (
                        <Link className="p-2" href="/login">
                           Login
                        </Link>
                     )}
                  </div>
               </nav>
            </header>

            <main className="container m-auto mt-4 px-4">{children}</main>

            <footer className="flex h-10 items-center justify-center shadow-inner">
               <p>Copyright © 2022 Amazona</p>
            </footer>
         </div>
      </>
   )
}

export default Layout
