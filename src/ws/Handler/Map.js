const RoomNew = require("./Room/New")
const {MESSAGE_HANDLERS} = require("../../util/constants/chat")

module.exports = {
    [MESSAGE_HANDLERS.ROOM_NEW]: RoomNew
}