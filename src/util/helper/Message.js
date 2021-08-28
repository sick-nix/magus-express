const Attachment = require('../../models/Attachment')

const MessageHelper = {
    async prepareMessage(message) {
        message.attachments = await Attachment.find({message: message._id})
    }
}

module.exports = MessageHelper