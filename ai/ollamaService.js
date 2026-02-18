const axios = require("axios")

async function askOllama(prompt) {
  const systemContext = `
  You are a MongoDB Query Generator.
  User Schema: { "id": Number, "name": String, "age": Number, "gender": String }

  Rules:
  1. For "create", EVERYTHING (id, name, age, gender) goes into the "payload" object. The "query" should be empty {}.
  2. For "get", "delete", or "update" (finding the user), use the "query" object.
  3. Ensure numbers are numbers, not strings.

  Example Correct Create:
  Request: "create user HP age 22 id 2003"
  Response: {"action": "create", "query": {}, "payload": {"id": 2003, "name": "HP", "age": 22, "gender": "male"}}
`

  try {
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "gemma3:4b", // or your preferred model
      prompt: `${systemContext}\nUser Request: "${prompt}"\nResponse:`,
      stream: false,
      format: "json",
    })

    return response.data.response
  } catch (error) {
    console.error("Ollama Error:", error)
    return null
  }
}

module.exports = askOllama
