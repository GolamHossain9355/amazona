import { getSession } from "next-auth/react"
import Order from "../../../models/Order"
import db from "../../../utils/db"

const handler = async (req, res) => {
   const session = await getSession({ req })
   console.log("order session", session)

   if (!session) {
      return res.status(401).send("Sign in required")
   }

   const { user } = session

   await db.connect()

   try {
      const newOrder = new Order({
         ...req.body,
         user: user._id,
      })

      const order = await newOrder.save()

      res.status(201).send(order)
   } catch (error) {
      console.error("Error placing order:", error)
      res.status(500).send("Error placing order")
   } finally {
      await db.disconnect()
   }
}

export default handler
