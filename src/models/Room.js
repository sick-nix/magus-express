const mongoose = require('mongoose')
const {ROOM_TYPES} = require("../constants/chat")
const RoomUser = require("../models/RoomUser")
const Message = require("../models/Message")

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

roomSchema.post('deleteOne', {document: true, query: false}, async function () {
    try {
        await RoomUser.deleteMany({
            room: this._id
        })
        const messages = await Message.find({ room: this._id })

        for(const message of messages) {
            await message.deleteOne()
        }
    } catch (err) {
        console.error(err)
    }
})

module.exports = mongoose.model('Room', roomSchema)