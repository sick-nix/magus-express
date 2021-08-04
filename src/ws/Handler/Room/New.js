const HandlerAbstract = require('../Abstract')
const Room = require('../../../models/Room')
const RoomUser = require('../../../models/RoomUser')
const {CHAT_USER_ROLES, MESSAGE_DISPATCHERS} = require("../../../util/constants/chat")

class RoomNew extends HandlerAbstract {
    async run() {
        const { name, users = [] } = this.getMessage().getData()

        const newRoom = new Room({name, ownerUser: this.getMessage().getConnection().currentUser._id})
        try {
            await newRoom.save()
            for(const user of users) {
                await (new RoomUser({
                    user,
                    room: newRoom.id,
                    role: CHAT_USER_ROLES.USER
                })).save()
            }
            await (new RoomUser({
                user: this.getMessage().getConnection().currentUser._id,
                room: newRoom.id,
                role: CHAT_USER_ROLES.OWNER
            })).save()

            this.getDispatcher().dispatch(MESSAGE_DISPATCHERS.ROOM_NEW, this.getMessage(), [newRoom])
        } catch (err) {
            console.error(err)
        }
    }
}

module.exports = RoomNew