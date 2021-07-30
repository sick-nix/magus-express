const mongoose = require('mongoose')
const robohashAvatars = require('robohash-avatars')

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
            this.avatar = robohashAvatars.generateAvatar({
                username: this.username,
                background: Object.values(robohashAvatars.BackgroundSets),
                characters: Object.values(robohashAvatars.CharacterSets),
                height: 40,
                width: 40
            })
        }
    }

    next()
})

module.exports = mongoose.model('User', userSchema)