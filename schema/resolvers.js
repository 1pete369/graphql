const { Query } = require("mongoose")
const User = require("../models/User.js")

const resolvers = {
  Query: {
    async getUsers() {
      return await User.find()
    },
  },
  Mutation: {
    async createUser(_, { userInput: { id, name, age, gender } }) {
      const createUser = new User({
        id: id,
        name: name,
        age: age,
        gender: gender,
      })

      const res = await createUser.save()

      return { id: res.id, ...res._doc }
    },
  },
}

module.exports = { resolvers }
