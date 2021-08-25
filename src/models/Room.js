const mongoose = require('mongoose')
const {ROOM_TYPES} = require("../constants/chat")

const roomSchema = new mongoose.Schema({
    name: {
        type: String
    },
    type: {
        type: String,
        default: ROOM_TYPES.CHANNEL
    },
    ownerUser: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    messageCount: {
        type: Number,
        default: 0
    }
})

roomSchema.pre('save', function (next) {
    if(this._id) this.updatedAt = Date.now()
    next()
})

module.exports = mongoose.model('Room', roomSchema)