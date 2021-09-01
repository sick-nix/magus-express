const HandlerAbstract = require('../Abstract')
const Message = require('../../../models/Message')
const {MESSAGE_DISPATCHERS} = require("../../../constants/chat")
const Room = require("../../../models/Room")
const RoomHelper = require("../../../util/helper/Room")

class MessageEdit extends HandlerAbstract {
    async run() {
        const { message, content } = this.getMessage().getData()

        const room = await Room.findById(message.room)
        await RoomHelper.setUserInactiveInRooms(this.getMessage().getConnection().currentUser)
        await RoomHelper.setUserActiveInRoom(room, this.getMessage().getConnection().currentUser, true)

        try {
            const updatedMessage = await Message.findById(message._id)
            updatedMessage.content = content
            await updatedMessage.save()

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

module.exports = MessageEdit