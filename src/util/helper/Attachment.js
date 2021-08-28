const v = require('voca')
const mongoose = require('mongoose')

const AttachmentHelper = {
    async createAttachment(uniq, file, user) {
        const { magusFileName, magusDestination, originalname, mimetype } = file
        const dest = v.substr(magusDestination, v.indexOf(magusDestination, '/media') + 6)
        const Attachment = require('../../models/Attachment')

        const attachment = Attachment.findOneAndUpdate({
            tempId: uniq
        },{
            origFilename: originalname,
            filename: magusFileName,
            filePath: dest + magusFileName,
            fileType: mimetype,
            createdBy: mongoose.Types.ObjectId(user._id)
        }, {
            new: true,
            useFindAndModify: false
        })

        return attachment
    },
    getPath(filePath) {
        return Magus.instance.getDir('../media', filePath)
    }
}

module.exports = AttachmentHelper