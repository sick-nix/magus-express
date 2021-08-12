const mongoose = require('mongoose')
const {ROOM_TYPES} = require("../constants/chat")

const roomUserSchema = new mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Room'
    },
    room_type: {
        type: String,
        default: ROOM_TYPES.CHANNEL
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    role: {
        type: String
    },
    hidden: {
        type: Boolean,
        default: false
    },
    lastMessageCount: {
        type: Number,
        default: 0
    },
    activeInRoom: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('RoomUser', roomUserSchema)