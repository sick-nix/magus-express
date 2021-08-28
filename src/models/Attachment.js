const mongoose = require('mongoose')
const AttachmentHelper = require('../util/helper/Attachment')
const fs = require('fs')

const attachmentSchema = new mongoose.Schema({
    tempId: {
        type: String
    },
    message: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    origFilename: {
        type: String
    },
    filename: {
        type: String
    },
    filePath: {
        type: String
    },
    fileType: {
        type: String
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

attachmentSchema.post('deleteOne', { document: true, query: false }, function () {
    if(this.filePath) {
        const path = AttachmentHelper.getPath(this.filePath)
        if (fs.existsSync(path)) {
            fs.unlink(path, err => {
                if (err) console.error(err)
            })
        }
    }
})

module.exports = mongoose.model('Attachment', attachmentSchema)