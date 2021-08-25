const DispatcherAbstract = require('../Abstract')
const Room = require('../../../models/Room')
const {MESSAGE_DISPATCHERS} = require("../../../constants/chat")
const RoomHelper = require('../../../util/helper/Room')
const DbHelper = require("../../../util/db")

class MessageEdit extends DispatcherAbstract {
    async run(message) {
        try {
            if(!message) message = this.getMessage().getData()
            const room = await Room.findById(message.room)

            let users = [ this.getMessage().getConnection().currentUser ]
            if(!message.private)
                users = await RoomHelper.getUsersByRoom(room)
            const userIds = DbHelper.getArrayOfField(users)

            // for each message set a from_user parameter
            const msg = this.createMessage({
                type: MESSAGE_DISPATCHERS.MESSAGE_DELETE,
                data: message
            })

            this.getContainer().sendToUsers(msg, userIds)
        } catch (err) {
            console.error(err)
        }
    }
}

module.exports = MessageEdit