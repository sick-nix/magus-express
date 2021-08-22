const HandlerAbstract = require('../Abstract')
const Message = require('../../../models/Message')
const {MESSAGE_DISPATCHERS} = require("../../../constants/chat")

class MessageGet extends HandlerAbstract {
    async run() {
        try {
            const { room, before } = this.getMessage().getData()
            // get messages for room
            // include only non private messages and own private messages
            let filter = {
                room: room._id,
                $and: [
                    { $or: [
                        {private: false},
                        {private: true, createdBy: this.getMessage().getConnection().currentUser}
                    ]}
                ]
            }
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