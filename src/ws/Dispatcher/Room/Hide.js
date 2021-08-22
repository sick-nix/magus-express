const DispatcherAbstract = require('../Abstract')
const {MESSAGE_DISPATCHERS} = require("../../../constants/chat")
const RoomHelper = require('../../../util/helper/Room')
const Room = require('../../../models/Room')

class RoomHide extends DispatcherAbstract {
    async run() {
        try {
            const currentUser = this.getMessage().getConnection().currentUser
            let room = (await Room.findById(this.getMessage()._id)).toObject()
            await RoomHelper.prepareRoom(
                room,
                {
                    currentUser
                }
            )

            const msg = this.createMessage({
                type: MESSAGE_DISPATCHERS.ROOM_HIDE,
                data: room
            })

            this.getContainer().sendToUsers(msg, [currentUser])
        } catch (err) {
            console.error(err)
        }
    }
}

module.exports = RoomHide