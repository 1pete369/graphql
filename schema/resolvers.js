<<<<<<< HEAD
const User = require("../models/User")
const askOllama = require("../ai/ollamaService")
=======
// D:\test project\graphql\schema\resolvers.js

const User = require("../models/User")

/*
================================
AI TEMPLATE (JSON OUTPUT ONLY)
================================
*/

const DB_TEMPLATE = `
You are a backend assistant.

Convert the user request into STRICT VALID JSON.

RULES:
- Return ONLY valid JSON (no markdown, no code fences, no explanation).
- Use double quotes for all keys and string values.
- Numbers MUST be valid JSON numbers (NO leading zeros like 01).
- Return exactly this shape:

{
  "action": "createUser",
  "data": {
    "id": 1,
    "name": "John",
    "age": 25,
    "gender": "male"
  }
}

User request:
`.trim()

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
      model: "gemma3:4b",
      prompt,
      stream: false,

      // ✅ This is the key fix: force JSON output mode
      format: "json",

      // ✅ Less randomness = fewer formatting mistakes
      options: {
        temperature: 0,
      },
    }),
  })

  // If Ollama server is down / wrong port, you'll see it clearly
  if (!res.ok) {
    const t = await res.text()
    throw new Error(`Ollama HTTP ${res.status}: ${t}`)
  }

  return await res.json()
}

/*
================================
SAFE JSON PARSE + VALIDATION
================================
*/

function safeParseJSON(raw) {
  // raw should already be JSON string because format:"json"
  // but we still guard in case the model misbehaves.
  let text = (raw ?? "").toString().trim()

  // Remove accidental code fences if any
  text = text.replace(/```json|```/g, "").trim()

  // Try direct parse
  try {
    return JSON.parse(text)
  } catch (e) {
    // Fallback: attempt to extract first JSON object
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) {
      throw new Error("No JSON object found in AI response")
    }

    // Extra guard: remove leading zeros in numbers like : 01 -> : 1
    const cleaned = match[0].replace(/:\s*0+(\d+)/g, ": $1")

    return JSON.parse(cleaned)
  }
}

function validateAIShape(obj) {
  if (!obj || typeof obj !== "object")
    throw new Error("AI output is not an object")

  if (typeof obj.action !== "string") throw new Error("Missing/invalid action")

  if (obj.action !== "createUser") {
    throw new Error(`Unsupported action: ${obj.action}`)
  }

  if (!obj.data || typeof obj.data !== "object")
    throw new Error("Missing data object")

  const { id, name, age, gender } = obj.data

  if (typeof id !== "number" || Number.isNaN(id))
    throw new Error("Invalid id (must be number)")
  if (typeof name !== "string" || !name.trim())
    throw new Error("Invalid name (must be string)")
  if (typeof age !== "number" || Number.isNaN(age))
    throw new Error("Invalid age (must be number)")
  if (typeof gender !== "string" || !gender.trim())
    throw new Error("Invalid gender (must be string)")

  return { id, name: name.trim(), age, gender: gender.trim() }
}

/*
================================
RESOLVERS
================================
*/
>>>>>>> 4075343e73338bea794800b2d060ed848cbfa757

const resolvers = {
  Query: {
    async getUsers() {
      return await User.find({})
    },
    async getUser(_, { id }) {
      return await User.findOne({ id: Number(id) })
    },

    async generateText(_, { prompt }) {
      try {
        const finalPrompt = `${DB_TEMPLATE}\n${prompt}`

        const ai = await callOllama(finalPrompt)

        // ✅ Ollama generate response body
        // ai.response is usually the text output
        const raw = ai?.response

        // Debug (keep this while testing)
        console.log(
          "\n===== OLLAMA RAW OUTPUT =====\n",
          raw,
          "\n============================\n",
        )

        // ✅ Parse + validate
        const parsed = safeParseJSON(raw)
        const userData = validateAIShape(parsed)

        // ✅ Execute action
        const user = new User(userData)
        await user.save()

        return {
          text: `User created: ${user.name}`,
          confidence: 1,
        }
      } catch (err) {
        console.error("generateText error:", err)

        return {
          text: "Execution failed",
          confidence: 0,
        }
      }
    },
  },

  Mutation: {
<<<<<<< HEAD
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
          case "get":
            // DYNAMIC: We pass the AI's 'query' directly to Mongoose
            console.log("EXECUTING MONGO QUERY:", JSON.stringify(query))
            const users = await User.find(query || {})
            return users

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
=======
    async createUser(_, { userInput }) {
      const user = new User(userInput)
      await user.save()
      return user
>>>>>>> 4075343e73338bea794800b2d060ed848cbfa757
    },
  },
}

module.exports = resolvers
