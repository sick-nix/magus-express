const HandlerAbstract = require('../Abstract')
const Message = require('../../../models/Message')
const {MESSAGE_DISPATCHERS} = require("../../../constants/chat")

class MessageRefetch extends HandlerAbstract {
    async run() {
        const { message } = this.getMessage().getData()

        try {
            const updatedMessage = await Message.findById(message._id)

            await this.getDispatcher().dispatch(
                MESSAGE_DISPATCHERS.MESSAGE_EDIT,
                this.getMessage(),
                [updatedMessage]
            )
        } catch (err) {
            console.error(err)
        }
    }
}

module.exports = MessageRefetch