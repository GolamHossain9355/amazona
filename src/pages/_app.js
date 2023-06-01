import { SessionProvider, useSession } from "next-auth/react"
import { StoreProvider } from "@/utils/Store"
import { useRouter } from "next/router"

import "./styles/globals.css"
import Layout from "@/components/Layout"
import { PayPalScriptProvider } from "@paypal/react-paypal-js"

export default function App({
   Component,
   pageProps: { session, ...pageProps },
}) {
   const title =
      typeof Component.title === "function"
         ? Component.title(pageProps)
         : Component.title

   return (
      <SessionProvider session={session}>
         <StoreProvider>
            <PayPalScriptProvider deferLoading={true}>
               <Layout title={title}>
                  {Component.auth ? (
                     <Auth adminOnly={Component.auth.adminOnly}>
                        <Component {...pageProps} />
                     </Auth>
                  ) : (
                     <Component {...pageProps} />
                  )}
               </Layout>
            </PayPalScriptProvider>
         </StoreProvider>
      </SessionProvider>
   )
}

function Auth({ children, adminOnly }) {
   const router = useRouter()
   const { status, data: session } = useSession({
      required: true,
      onUnauthenticated() {
         router.push("/unauthorized?message=login required")
      },
   })

   if (status === "loading") {
      return <div>Loading...</div>
   }

   if (adminOnly && !session.user.isAdmin) {
      router.push("/unauthorized?message=admin login required")
   }

   return children
}
