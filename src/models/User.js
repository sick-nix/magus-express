const mongoose = require('mongoose')
const getRandomAvatar = require('../util/avatar')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    avatar: {
        type: String
    }
})

userSchema.pre('save', function (next) {
    if(this._id) {
        if(!this.avatar) {
            this.avatar = getRandomAvatar(this.username)
        }
    }

    next()
})

module.exports = mongoose.model('User', userSchema)