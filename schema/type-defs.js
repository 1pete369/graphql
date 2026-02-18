const { gql } = require("apollo-server")

const typeDefs = gql`
  type User {
    id: Int!
    name: String!
    age: Int
    gender: String
  }

  type Query {
    getUsers: [User!]! # optional for listing all users
    getUser(id: Int!): User # optional single user query
  }

  type Mutation {
    askAI(prompt: String!): [User!]! # AI-driven CRUD
  }
`

module.exports = typeDefs
