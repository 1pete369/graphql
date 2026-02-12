const User = require("../models/User")

/*
================================
AI TEMPLATE (JSON OUTPUT ONLY)
================================
*/

const DB_TEMPLATE = `
You are a backend assistant.

Convert the user request into JSON.

ONLY return valid JSON.
No text. No explanation.

Format:

{
  "action": "createUser",
  "data": {
    "id": number,
    "name": string,
    "age": number,
    "gender": string
  }
}

User request:
`

/*
================================
OLLAMA CALL
================================
*/

async function callOllama(prompt) {
  const res = await fetch("http://127.0.0.1:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "deepseek-r1:latest",
      prompt,
      stream: false,
    }),
  })

  return await res.json()
}

/*
================================
RESOLVERS
================================
*/

const resolvers = {
  Query: {
    async getUsers() {
      return await User.find()
    },

    async generateText(_, { prompt }) {
      try {
        const finalPrompt = DB_TEMPLATE + prompt
        const ai = await callOllama(finalPrompt)

        // Parse AI JSON
        const parsed = JSON.parse(ai.response)

        // Execute action
        if (parsed.action === "createUser") {
          const user = new User(parsed.data)
          await user.save()

          return {
            text: `User created: ${user.name}`,
            confidence: 1,
          }
        }

        return {
          text: "Unknown action",
          confidence: 0,
        }
      } catch (err) {
        console.error(err)

        return {
          text: "Execution failed",
          confidence: 0,
        }
      }
    },
  },

  Mutation: {
    async createUser(_, { userInput }) {
      const user = new User(userInput)
      await user.save()
      return user
    },
  },
}

module.exports = { resolvers }
