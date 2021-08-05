const DispatcherAbstract = require('../Abstract')
const Room = require('../../../models/Room')
const Message = require('../../Message')
const {MESSAGE_DISPATCHERS} = require("../../../util/constants/chat")
const RoomHelper = require('../../../util/helper/Room')
const DbHelper = require("../../../util/db")

class RoomNew extends DispatcherAbstract {
    async run(room) {
        try {
            if(room instanceof Room) room = room.toObject()
            const users = await RoomHelper.getUsersByRoom(room)
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