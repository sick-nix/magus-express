const DispatcherAbstract = require('../Abstract')
const {MESSAGE_DISPATCHERS} = require("../../../constants/chat")

class RoomDelete extends DispatcherAbstract {
    async run(room, users) {
        const msg = this.createMessage({
            type: MESSAGE_DISPATCHERS.ROOM_DELETE,
            data: room
        })

        this.getContainer().sendToUsers(msg, users)
    }
}

module.exports = RoomDelete