const HandlerAbstract = require('../Abstract')
const Message = require('../../../models/Message')
const {MESSAGE_DISPATCHERS} = require("../../../constants/chat")

class MessageDelete extends HandlerAbstract {
    async run() {
        const message = this.getMessage().getData()

        try {
            await (await Message.findById(message._id)).deleteOne()
            await this.getDispatcher().dispatch(
                MESSAGE_DISPATCHERS.MESSAGE_DELETE,
                this.getMessage(),
                []
            )
        } catch (err) {
            console.error(err)
        }
    }
}

module.exports = MessageDelete