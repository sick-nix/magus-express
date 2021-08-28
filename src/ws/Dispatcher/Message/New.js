const DispatcherAbstract = require('../Abstract')
const Room = require('../../../models/Room')
const RoomUser = require('../../../models/RoomUser')
const {MESSAGE_DISPATCHERS} = require("../../../constants/chat")
const RoomHelper = require('../../../util/helper/Room')
const MessageHelper = require('../../../util/helper/Message')
const DbHelper = require("../../../util/db")
const {ROOM_TYPES} = require("../../../constants/chat")

class MessageNew extends DispatcherAbstract {
    async run(message) {
        try {
            message = message.toObject()
            const room = await Room.findById(message.room)

            let users = [ this.getMessage().getConnection().currentUser ]
            if(!message.private) {
                room.messageCount++
                await room.save()

                users = await RoomHelper.getUsersByRoom(room)

                if(room.type === ROOM_TYPES.DIRECT) {
                    const otherUser = users.find(user => user._id.toString() !== this.getMessage().getConnection().currentUser._id.toString())
                    const roomUserRelation = await RoomUser.findOne({room: room._id, user: otherUser._id})
                    let previousHiddenValue = undefined
                    if(roomUserRelation && roomUserRelation.hidden){
                        previousHiddenValue = false
                        roomUserRelation.hidden = false
                        await roomUserRelation.save()
                    }

                    if(previousHiddenValue === false)
                        await this.getDispatcher().dispatch(MESSAGE_DISPATCHERS.ROOM_NEW, this.getMessage(), [room, {
                            currentUser: otherUser
                        }])
                }
            }
            const userIds = DbHelper.getArrayOfField(users)

            if(!message.private) {
                for(const id of userIds) {
                    const relation = await RoomHelper.getRoomUserRelation(room, id)
                    if (relation && relation.activeInRoom) {
                        relation.lastMessageCount++
                        await relation.save()
                    }
                }
            }

            await MessageHelper.prepareMessage(message)

            // for each message set a from_user parameter
            const msg = this.createMessage({
                type: MESSAGE_DISPATCHERS.MESSAGE_NEW,
                data: message
            })

            this.getContainer().sendToUsers(msg, userIds)
        } catch (err) {
            console.error(err)
        }
    }
}

module.exports = MessageNew