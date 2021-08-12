const HandlerAbstract = require('../Abstract')
const Message = require('../../../models/Message')
const {MESSAGE_DISPATCHERS} = require("../../../constants/chat")

class MessageNew extends HandlerAbstract {
    async run() {
        const newMessage = new Message({
            ...this.getMessage().getData(),
            createdBy: this.getMessage().getConnection().currentUser._id
        })
        try {
            await newMessage.save()
            await this.getDispatcher().dispatch(MESSAGE_DISPATCHERS.MESSAGE_NEW, this.getMessage(), [newMessage])
        } catch (err) {
            console.error(err)
        }
    }
}

module.exports = MessageNew