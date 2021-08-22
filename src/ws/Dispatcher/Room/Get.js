const DispatcherAbstract = require('../Abstract')
const {MESSAGE_DISPATCHERS} = require("../../../constants/chat")
const RoomHelper = require('../../../util/helper/Room')

class RoomGet extends DispatcherAbstract {
    async run(room) {
        try {
            const currentUser = this.getMessage().getConnection().currentUser

            let rooms = await RoomHelper.getRoomsByUser(currentUser)
            rooms = await Promise.all(rooms.map(async room => {
                await RoomHelper.prepareRoom(room, {currentUser})
                return room
            }))
            const msg = this.createMessage({
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