const HandlerAbstract = require('../Abstract')
const {MESSAGE_DISPATCHERS} = require("../../../constants/chat")
const RoomHelper = require('../../../util/helper/Room')

class RoomHide extends HandlerAbstract {
    async run() {
        await RoomHelper.setHiddenForRelation(
            this.getMessage().getData(),
            this.getMessage().getConnection().currentUser,
            true
        )

        await this.getDispatcher().dispatch(MESSAGE_DISPATCHERS.ROOM_HIDE, this.getMessage(), [])
    }
}

module.exports = RoomHide