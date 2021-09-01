const HandlerAbstract = require('../Abstract')
const Message = require('../../../models/Message')
const {MESSAGE_DISPATCHERS} = require("../../../constants/chat")
const RoomHelper = require("../../../util/helper/Room")
const Room = require('../../../models/Room')

class MessageDelete extends HandlerAbstract {
    async run() {
        const message = this.getMessage().getData()
        const room = await Room.findById(message.room)
        await RoomHelper.setUserInactiveInRooms(this.getMessage().getConnection().currentUser)
        await RoomHelper.setUserActiveInRoom(room, this.getMessage().getConnection().currentUser, true)

        try {
            const foundMessage = await Message.findById(message._id)
            if(foundMessage)
                await foundMessage.deleteOne()
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