import Product from "@/models/Product"
import db from "@/utils/db"
import { getSession } from "next-auth/react"

const handler = async (req, res) => {
   const session = await getSession({ req })
   console.log(session)

   const productID = req.query._id

   await db.connect()
   const foundProduct = await Product.findById(productID)
   await db.disconnect()

   res.status(200).json(foundProduct)
}

export default handler
