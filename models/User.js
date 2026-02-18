const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: Number },
  gender: { type: String },
})

module.exports = mongoose.model("User", userSchema)
