const DispatcherAbstract = require('../Abstract')
const Room = require('../../../models/Room')
const Message = require('../../Message')
const {MESSAGE_DISPATCHERS} = require("../../../constants/chat")
const RoomHelper = require('../../../util/helper/Room')
const DbHelper = require("../../../util/db")
const {ROOM_TYPES} = require("../../../constants/chat")

class RoomNew extends DispatcherAbstract {
    async run(room) {
        try {
            if(room instanceof Room) room = room.toObject()
            // if room is of type direct, only send room to user that created the room
            let users = await RoomHelper.getUsersByRoom(room)
            if(room.type === ROOM_TYPES.DIRECT) {
                const otherUser = users.find(user => user._id !== this.getMessage().getConnection().currentUser._id)
                if(otherUser)
                    room.name = otherUser.username
                users = [ this.getMessage().getConnection().currentUser ]
            }

            const userIds = DbHelper.getArrayOfField(users)

            const msg = new Message({
                type: MESSAGE_DISPATCHERS.ROOM_NEW,
                data: {
                    ...room,
                    users: userIds
                }
            })

            this.getContainer().sendToUsers(msg, users)
        } catch (err) {
            console.error(err)
        }
    }
}

module.exports = RoomNew