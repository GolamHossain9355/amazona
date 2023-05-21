const mongoose = require("mongoose")

const connection = {}

async function connect() {
   if (connection.isConnected) {
      console.info("Already connected")
      return
   }

   if (mongoose.connections.length > 0) {
      connection.isConnected = mongoose.connections[0].readyState
      if (connection.isConnected === 1) {
         console.info("Using existing database connection")
         return
      }
      await mongoose.disconnect()
   }

   const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
   })

   console.info("Using new connection")
   connection.isConnected = db.connections[0].readyState
}

async function disconnect() {
   if (connection.isConnected && process.env.NODE_ENV === "production") {
      await mongoose.disconnect()
      connection.isConnected = false
      console.info("Disconnected")
      return
   }

   console.info("Not disconnected")
}

const db = { connect, disconnect }

export default db
