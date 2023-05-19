import React from "react"
import Head from "next/head"

function Layout({ children, title }) {
   return (
      <>
         <Head>
            <title>{title ? title + " - Amazona" : "Amazona"}</title>
            <meta name="description" content="E-Commerce Website" />
            <link rel="icon" href="/favicon.ico" />
         </Head>

         <div className="flex min-h-screen flex-col">
            <header>Header</header>

            <main>{children}</main>

            <footer>footer</footer>
         </div>
      </>
   )
}

export default Layout
