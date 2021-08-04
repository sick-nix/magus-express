const RoomNew = require("./Room/New")
const {MESSAGE_DISPATCHERS} = require("../../util/constants/chat")

module.exports = {
    [MESSAGE_DISPATCHERS.ROOM_NEW]: RoomNew
}