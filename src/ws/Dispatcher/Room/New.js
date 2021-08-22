const DispatcherAbstract = require('../Abstract')
const Room = require('../../../models/Room')
const {MESSAGE_DISPATCHERS} = require("../../../constants/chat")
const RoomHelper = require('../../../util/helper/Room')
const {ROOM_TYPES} = require("../../../constants/chat")

class RoomNew extends DispatcherAbstract {
    async run(room, params = {}) {
        try {
            let { currentUser = this.getMessage().getConnection().currentUser } = params
            if(room instanceof Room) room = room.toObject()
            // if room is of type direct, only send room to user that created the room
            let users = await RoomHelper.getUsersByRoom(room)
            let usersToSendMessageTo = users
            if(room.type === ROOM_TYPES.DIRECT) usersToSendMessageTo = [ currentUser ]

            for(const user of usersToSendMessageTo) {
                await RoomHelper.prepareRoom(room, {currentUser})

                const msg = this.createMessage({
                    type: MESSAGE_DISPATCHERS.ROOM_NEW,
                    data: {
                        ...room,
                        users
                    }
                })

                this.getContainer().sendToUsers(msg, [user])
            }
        } catch (err) {
            console.error(err)
        }
    }
}

module.exports = RoomNew