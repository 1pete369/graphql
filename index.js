<<<<<<< HEAD
require("dotenv").config()
const { ApolloServer } = require("apollo-server")
const connectDB = require("./config/db")
const typeDefs = require("./schema/type-defs.js")
const resolvers = require("./schema/resolvers.js")

const startServer = async () => {
  await connectDB()

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })

  const { url } = await server.listen({ port: 4000 })
  console.log(`Server running at ${url}`)
}

startServer()
=======
const { ApolloServer } = require("apollo-server")
const mongoose = require("mongoose")

const { typeDefs } = require("./schema/type-defs")
const { resolvers } = require("./schema/resolvers")

const MONGODB_URI =
  "mongodb+srv://kureddy095_db_user:QenQCitSirHBC6YN@cluster0.5y3e4uh.mongodb.net/graphql?appName=Cluster0"

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected")
    return server.listen({ port: 4000 })
  })
  .then(({ url }) => {
    console.log(`Server running at ${url}`)
  })
  .catch(console.error)
>>>>>>> 4075343e73338bea794800b2d060ed848cbfa757
