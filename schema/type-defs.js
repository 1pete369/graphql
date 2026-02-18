const { gql } = require("apollo-server")

const typeDefs = gql`
<<<<<<< HEAD
=======
  # Existing types and queries...
>>>>>>> 4075343e73338bea794800b2d060ed848cbfa757
  type User {
    id: Int!
    name: String!
    age: Int
    gender: String
  }

<<<<<<< HEAD
  type Query {
    getUsers: [User!]! # optional for listing all users
    getUser(id: Int!): User # optional single user query
  }

  type Mutation {
    askAI(prompt: String!): [User!]! # AI-driven CRUD
  }
`

module.exports = typeDefs
=======
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
>>>>>>> 4075343e73338bea794800b2d060ed848cbfa757
