const HandlerAbstract = require('../Abstract')
const {MESSAGE_DISPATCHERS} = require("../../../constants/chat")
const RoomHelper = require('../../../util/helper/Room')

class RoomDelete extends HandlerAbstract {
    async run() {
        const { users, room } = await RoomHelper.deleteRoom(this.getMessage().getData())
        await this.getDispatcher().dispatch(MESSAGE_DISPATCHERS.ROOM_DELETE, this.getMessage(), [room, users])
    }
}

module.exports = RoomDelete