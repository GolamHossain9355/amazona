import React from "react"
import { useRouter } from "next/router"
import PageHeading from "@/components/PageHeading"

UnauthorizedScreen.title = "Unauthorized Page"
function UnauthorizedScreen() {
   const router = useRouter()
   const { message } = router.query
   return (
      <>
         <PageHeading>Access Denied</PageHeading>

         {message && <div className="mb-4 text-red-500">{message}</div>}
      </>
   )
}

export default UnauthorizedScreen
