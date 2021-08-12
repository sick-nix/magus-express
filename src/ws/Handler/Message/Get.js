const HandlerAbstract = require('../Abstract')
const Message = require('../../../models/Message')
const {MESSAGE_DISPATCHERS} = require("../../../constants/chat")

class MessageGet extends HandlerAbstract {
    async run() {
        try {
            const { room, before } = this.getMessage().getData()
            let filter = {room: room._id}
            if(before) filter['_id'] = {'$lte': before}
            // get last 50 messages from the end
            const messages = (await Message.find(filter).sort({'_id': -1}).limit(50))
            if(messages) messages.reverse()
            await this.getDispatcher().dispatch(MESSAGE_DISPATCHERS.MESSAGE_GET, this.getMessage(), [messages])
        } catch (err) {
            console.error(err)
        }
    }
}

module.exports = MessageGet