const { gql } = require("apollo-server")

const typeDefs = gql`
  # Existing types and queries...
  type User {
    id: Int!
    name: String!
    age: Int
    gender: String
  }

  # Add new type for AI response
  type AIResponse {
    text: String!
    confidence: Float
  }

  # Add new query
  type Query {
    getUsers: [User!]!
    generateText(prompt: String!): AIResponse!
  }

  # Keep existing input type
  input UserInput {
    id: Int!
    name: String!
    age: Int
    gender: String
  }

  # Add new mutation if needed
  type Mutation {
    createUser(userInput: UserInput): User!
  }
`

module.exports = { typeDefs }
