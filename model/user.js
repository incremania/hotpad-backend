const {Schema, default: mongoose, mongo } = require("mongoose");

const userSchema = new Schema({
    userName: {
        type: String
    }
})

module.exports = mongoose.model('User', userSchema)