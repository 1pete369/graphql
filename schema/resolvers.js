const User = require("../models/User")
const askOllama = require("../ai/ollamaService")

const resolvers = {
  Query: {
    async getUsers() {
      return await User.find({})
    },
    async getUser(_, { id }) {
      return await User.findOne({ id: Number(id) })
    },
  },

  Mutation: {
    async askAI(_, { prompt }) {
      console.log("--- NEW REQUEST ---")
      console.log("PROMPT:", prompt)

      const aiResponse = await askOllama(prompt)
      if (!aiResponse) return []

      let parsed
      try {
        parsed = JSON.parse(aiResponse)
        console.log("AI STRUCTURE:", parsed)
      } catch (err) {
        console.error("JSON PARSE ERROR:", err)
        return []
      }

      const { action, query, payload } = parsed

      try {
        switch (action) {
          case "get": {
            // If the AI sends a simple string { name: "charlie" },
            // we manually upgrade it to a regex for the user.
            let finalQuery = { ...query }

            for (let key in finalQuery) {
              // If the value is a string and not already an object/regex
              if (typeof finalQuery[key] === "string" && key !== "id") {
                finalQuery[key] = {
                  $regex: new RegExp(`^${finalQuery[key]}$`, "i"),
                }
              }
            }

            console.log("UPGRADED MONGO QUERY:", JSON.stringify(finalQuery))
            const users = await User.find(finalQuery)
            return users
          }

          case "create": {
            // Use payload, but fallback to query if the AI got confused
            const userData = { ...parsed.query, ...parsed.payload }

            console.log("FINAL USER DATA FOR CREATION:", userData)

            const existing = await User.findOne({ id: Number(userData.id) })
            if (existing) return [existing]

            const newUser = new User({
              id: Number(userData.id),
              name: userData.name,
              age: Number(userData.age),
              gender: userData.gender || "unknown",
            })

            const savedUser = await newUser.save()
            console.log("SUCCESSFULLY CREATED:", savedUser)
            return [savedUser]
          }

          case "update":
            // AI identifies the user by query, applies payload
            const updated = await User.findOneAndUpdate(
              query,
              { $set: payload },
              { new: true },
            )
            return updated ? [updated] : []

          case "delete":
            const deleted = await User.findOneAndDelete(query)
            return deleted ? [deleted] : []

          default:
            console.warn("UNSUPPORTED ACTION:", action)
            return []
        }
      } catch (err) {
        console.error("DB ERROR:", err)
        return []
      }
    },
  },
}

module.exports = resolvers
