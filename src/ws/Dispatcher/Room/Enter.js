const DispatcherAbstract = require('../Abstract')
const Message = require('../../Message')
const {MESSAGE_DISPATCHERS} = require("../../../constants/chat")
const RoomHelper = require('../../../util/helper/Room')

class RoomEnter extends DispatcherAbstract {
    async run(room) {
        try {
            const currentUser = this.getMessage().getConnection().currentUser

            const msg = new Message({
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