const mongoose = require('mongoose')
const Attachment = require('./Attachment')

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
        type: Date
    },
    updatedAt: {
        type: Date
    }
})

messageSchema.pre('save', function (next) {
    const now = Date.now()
    if(!this.createdAt)
        this.createdAt = now
    this.updatedAt = now
    next()
})

messageSchema.post('deleteOne', { document: true, query: false },async function (next) {
    const attachments = await Attachment.find({
        message: this._id
    })

    for(const attachment of attachments) {
        await attachment.deleteOne()
    }
})

module.exports = mongoose.model('Message', messageSchema)