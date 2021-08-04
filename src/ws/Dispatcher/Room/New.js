const DispatcherAbstract = require('../Abstract')
const Room = require('../../../models/Room')
const Message = require('../../Message')
const {MESSAGE_DISPATCHERS} = require("../../../util/constants/chat")
const RoomHelper = require('../../../util/helper/Room')

class RoomNew extends DispatcherAbstract {
    async run(room) {
        try {
            if(room instanceof Room) room = room.toObject()
            const users = RoomHelper.getUsersByRoom(room)

            const msg = new Message({
                type: MESSAGE_DISPATCHERS.ROOM_NEW,
                data: {...room}
            })

            this.getContainer().sendToUsers(msg, users)
        } catch (err) {
            console.error(err)
        }
    }
}

module.exports = RoomNew