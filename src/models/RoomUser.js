const mongoose = require('mongoose')

const roomUserSchema = new mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Room'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    role: {
        type: String
    }
})

module.exports = mongoose.model('RoomUser', roomUserSchema)