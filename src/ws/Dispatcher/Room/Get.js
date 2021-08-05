const DispatcherAbstract = require('../Abstract')
const Room = require('../../../models/Room')
const Message = require('../../Message')
const {MESSAGE_DISPATCHERS} = require("../../../util/constants/chat")
const RoomHelper = require('../../../util/helper/Room')

class RoomGet extends DispatcherAbstract {
    async run(room) {
        try {
            const currentUser = this.getMessage().getConnection().currentUser

            const rooms = await RoomHelper.getRoomsByUser(currentUser)
            const msg = new Message({
                type: MESSAGE_DISPATCHERS.ROOM_GET,
                data: {rooms}
            })

            this.getContainer().sendToUsers(msg, [currentUser])
        } catch (err) {
            console.error(err)
        }
    }
}

module.exports = RoomGet