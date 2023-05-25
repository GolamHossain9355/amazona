import User from "@/models/User"
import db from "@/utils/db"
import bcryptjs from "bcryptjs"

async function handler(req, res) {
   if (req.method !== "POST") {
      return res.status(400).send("Only POST requests are allowed")
   }

   const { name, email, password } = req.body

   if (
      !name ||
      !email ||
      !email.includes("@") ||
      !password ||
      password.trim().length < 3
   ) {
      return res.status(422).json({
         message: "Validation Error when registering user",
      })
   }

   await db.connect()

   const existingUser = await User.findOne({ email })
   if (existingUser) {
      res.status(422).json({ message: "User exists already!" })
      await db.disconnect()
      return
   }

   const newUser = new User({
      name,
      email,
      password: bcryptjs.hashSync(password),
      isAdmin: false,
   })

   const user = await newUser.save()

   await db.disconnect()

   res.status(201).send({
      message: "Created user!",
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
   })
}

export default handler
