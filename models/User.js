const {model, Schema} =  require("mongoose")


const userSchema = new Schema({
    id : Number,
    name : String,
    age : Number,
    gender : String
})

module.exports = model("User", userSchema)

