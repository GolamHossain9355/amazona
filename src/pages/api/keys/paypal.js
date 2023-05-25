import { getSession } from "next-auth/react"

const handler = async (req, res) => {
   const session = getSession({ req })
   if (!session) {
      res.status(401).send("Sign in required")
      return
   }

   res.status(200).send(process.env.PAYPAL_CLIENT_ID || "sb")
}

export default handler
