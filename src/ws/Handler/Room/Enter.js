const HandlerAbstract = require('../Abstract')
const {MESSAGE_DISPATCHERS} = require("../../../constants/chat")
const RoomHelper = require('../../../util/helper/Room')

class RoomEnter extends HandlerAbstract {
    async run() {
        await RoomHelper.setUserInactiveInRooms(this.getMessage().getConnection().currentUser)
        await RoomHelper.setUserActiveInRoom(this.getMessage(), this.getMessage().getConnection().currentUser, true)
        await this.getDispatcher().dispatch(MESSAGE_DISPATCHERS.ROOM_ENTER, this.getMessage(), [])
    }
}

module.exports = RoomEnter