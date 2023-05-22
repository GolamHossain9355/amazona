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

function convertDocToObject(doc) {
   if (Array.isArray(doc)) {
      return doc.map((item) => {
         item._id = item._id.toString()
         item.createdAt = item.createdAt.toString()
         item.updatedAt = item.updatedAt.toString()
         return item
      })
   }

   doc._id = doc._id.toString()
   doc.createdAt = doc.createdAt.toString()
   doc.updatedAt = doc.updatedAt.toString()
   return doc
}

const db = { connect, disconnect, convertDocToObject }

export default db
