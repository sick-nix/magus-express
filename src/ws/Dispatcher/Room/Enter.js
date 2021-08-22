const DispatcherAbstract = require('../Abstract')
const {MESSAGE_DISPATCHERS} = require("../../../constants/chat")

class RoomEnter extends DispatcherAbstract {
    async run(room) {
        try {
            const currentUser = this.getMessage().getConnection().currentUser

            const msg = this.createMessage({
                type: MESSAGE_DISPATCHERS.ROOM_ENTER,
                data: this.getMessage().getData()
            })

            this.getContainer().sendToUsers(msg, [currentUser])
        } catch (err) {
            console.error(err)
        }
    }
}

module.exports = RoomEnter