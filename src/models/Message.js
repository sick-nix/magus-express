const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    content: {
        type: String
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Room'
    },
    private: {
        type: Boolean,
        default: false
    },
    createdBy: {
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
    }
})

messageSchema.pre('save', function (next) {
    if(this._id) this.updatedAt = Date.now
    next()
})

module.exports = mongoose.model('Message', messageSchema)