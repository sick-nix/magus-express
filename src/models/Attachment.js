const mongoose = require('mongoose')

const attachmentSchema = new mongoose.Schema({
    message: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Message'
    },
    filename: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        required: true
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
})

module.exports = mongoose.model('Attachment', attachmentSchema)