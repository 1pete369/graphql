const { gql } = require("apollo-server")

const typeDefs = gql `
    type User{
        id : Int!
        name : String!
        age : Int!
        gender : String!
    }

    type Query{
        getUsers : [User!]!
    }
    
    input UserInput{
        id : Int!
        name : String!
        age : Int
        gender : String
    }

    type Mutation{
        createUser(userInput : UserInput) : User!
    }

`

module.exports ={typeDefs}