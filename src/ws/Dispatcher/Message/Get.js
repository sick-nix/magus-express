const DispatcherAbstract = require('../Abstract')
const {MESSAGE_DISPATCHERS} = require("../../../constants/chat")
const DbHelper = require("../../../util/db")
const MessageHelper = require("../../../util/helper/Message")

class MessageGet extends DispatcherAbstract {
    async run(messages) {
        try {
            let users = [ this.getMessage().getConnection().currentUser ]
            const userIds = DbHelper.getArrayOfField(users)

            messages = await Promise.all(messages.map(async msg => {
                const msgObject = msg.toObject()
                await MessageHelper.prepareMessage(msgObject)
                return msgObject
            }))

            const msg = this.createMessage({
                type: MESSAGE_DISPATCHERS.MESSAGE_GET,
                data: {
                    ...this.getMessage().getData(),
                    messages
                }
            })

            this.getContainer().sendToUsers(msg, userIds)
        } catch (err) {
            console.error(err)
        }
    }
}

module.exports = MessageGet