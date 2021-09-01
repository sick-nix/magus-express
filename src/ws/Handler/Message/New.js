const HandlerAbstract = require('../Abstract')
const Message = require('../../../models/Message')
const Attachment = require('../../../models/Attachment')
const {MESSAGE_DISPATCHERS} = require("../../../constants/chat")
const Room = require("../../../models/Room")
const RoomHelper = require("../../../util/helper/Room")

class MessageNew extends HandlerAbstract {
    async run() {
        const { attachment, ...otherData } = this.getMessage().getData()

        const room = await Room.findById(otherData.room)
        await RoomHelper.setUserInactiveInRooms(this.getMessage().getConnection().currentUser)
        await RoomHelper.setUserActiveInRoom(room, this.getMessage().getConnection().currentUser, true)

        const newMessage = new Message({
            ...otherData,
            createdBy: this.getMessage().getConnection().currentUser._id
        })
        try {
            await newMessage.save()

            let attachmentModel = null
            if(attachment && attachment.uniq) {
                attachmentModel = new Attachment({
                    tempId: attachment.uniq,
                    createdBy: this.getMessage().getConnection().currentUser._id,
                    message: newMessage._id
                })
                await attachmentModel.save()
            }

            await this.getDispatcher().dispatch(MESSAGE_DISPATCHERS.MESSAGE_NEW, this.getMessage(), [newMessage])
        } catch (err) {
            console.error(err)
        }
    }
}

module.exports = MessageNew