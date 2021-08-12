const DispatcherAbstract = require('../Abstract')
const Message = require('../../Message')
const {MESSAGE_DISPATCHERS} = require("../../../constants/chat")
const DbHelper = require("../../../util/db")

class MessageGet extends DispatcherAbstract {
    async run(messages) {
        try {
            let users = [ this.getMessage().getConnection().currentUser ]
            const userIds = DbHelper.getArrayOfField(users)

            const msg = new Message({
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