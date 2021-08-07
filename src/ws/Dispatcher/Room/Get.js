const DispatcherAbstract = require('../Abstract')
const Room = require('../../../models/Room')
const Message = require('../../Message')
const {MESSAGE_DISPATCHERS} = require("../../../constants/chat")
const RoomHelper = require('../../../util/helper/Room')
const {ROOM_TYPES} = require("../../../constants/chat")

class RoomGet extends DispatcherAbstract {
    async run(room) {
        try {
            const currentUser = this.getMessage().getConnection().currentUser

            let rooms = await RoomHelper.getRoomsByUser(currentUser)
            rooms = await Promise.all(rooms.map(async room => {
                // If room is direct set name of room
                if(room.type === ROOM_TYPES.DIRECT) {
                    const users = await RoomHelper.getUsersByRoom(room)
                    const otherUser = users.find(user => user._id !== this.getMessage().getConnection().currentUser._id)
                    if(otherUser)
                        room.name = otherUser.username
                    return room
                }
                return room
            }))
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