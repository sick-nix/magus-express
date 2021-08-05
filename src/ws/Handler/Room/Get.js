const HandlerAbstract = require('../Abstract')
const {MESSAGE_DISPATCHERS} = require("../../../util/constants/chat")

class RoomGet extends HandlerAbstract {
    async run() {
        await this.getDispatcher().dispatch(MESSAGE_DISPATCHERS.ROOM_GET, this.getMessage(), [])
    }
}

module.exports = RoomGet