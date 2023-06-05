import { getSession } from "next-auth/react"
import Product from "../../../../models/Product"
import db from "../../../../utils/db"

const handler = async (req, res) => {
   const session = await getSession({ req })
   if (!session || !session.user.isAdmin) {
      return res.status(401).send("Admin Sign in required")
   }

   if (req.method === "GET") {
      return await getHandler(req, res)
   } else {
      return res.status(400).send({ message: "Method not allowed" })
   }
}

const getHandler = async (_req, res) => {
   await db.connect()
   const products = await Product.find({})
   await db.disconnect()
   res.status(200).send(products)
}
export default handler
