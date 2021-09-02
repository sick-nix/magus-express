const HandlerAbstract = require('../Abstract')
const Room = require('../../../models/Room')
const RoomUser = require('../../../models/RoomUser')
const {CHAT_USER_ROLES, MESSAGE_DISPATCHERS} = require("../../../constants/chat")
const _ = require('lodash')
const {ROOM_TYPES} = require("../../../constants/chat")
const RoomHelper = require('../../../util/helper/Room')

class RoomNew extends HandlerAbstract {
    async run() {
        let { name, type, users = [] } = this.getMessage().getData()

        if(_.isString(users)) users = [ users ]

        let existingRoom = null

        if(type === ROOM_TYPES.DIRECT)
            existingRoom = await RoomHelper.getDirectRoomByUserPair([
                ...users,
                this.getMessage().getConnection().currentUser
            ])

        if(existingRoom) {
            await RoomHelper.setHiddenForRelation(existingRoom, this.getMessage().getConnection().currentUser, false)
        }

        let newRoom = existingRoom
        try {
            if(!existingRoom) {
                newRoom = new Room({name, type, ownerUser: this.getMessage().getConnection().currentUser._id})
                let hidden = false
                if (type === ROOM_TYPES.DIRECT)
                    hidden = true
                await newRoom.save()
                for (const user of users) {
                    await (new RoomUser({
                        user,
                        hidden,
                        room: newRoom.id,
                        role: CHAT_USER_ROLES.USER,
                        room_type: type
                    })).save()
                }
                await (new RoomUser({
                    user: this.getMessage().getConnection().currentUser._id,
                    room: newRoom.id,
                    role: CHAT_USER_ROLES.OWNER,
                    room_type: type
                })).save()
            }

            await this.getDispatcher().dispatch(MESSAGE_DISPATCHERS.ROOM_NEW, this.getMessage(), [newRoom])
        } catch (err) {
            console.error(err)
        }
    }
}

module.exports = RoomNew