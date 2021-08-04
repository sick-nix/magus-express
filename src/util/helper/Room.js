const Room = require('../../models/Room')
const RoomUser = require('../../models/RoomUser')
const User = require('../../models/User')

const RoomHelper = {
    /**
     * @param {Room|string|Object} room
     * @return {Array}
     */
    async getUsersByRoom(room) {
        let roomId = room
        if(room instanceof Room || (room instanceof Object && room._id))
            roomId = room._id

        try {
            const users = await RoomUser.find({ room: roomId })
            if(users) return users
        } catch (err) {
            console.error(err)
        }

        return []
    },
    async getRoomsByUser(user) {
        const userId = this._getUserId(user)
        if(!userId) return []

        try {
            const roomIds = await RoomUser.find({user: userId}).distinct('room')
            if(roomIds) {
                return await Room.find({'_id': {'$in': roomIds}})
            }
        } catch (err) {
            console.error(err)
        }

        return []
    },
    /**
     * @param {RoomUser|User|string} user
     * @return {string}
     * @private
     */
    _getUserId(user) {
        if(user instanceof RoomUser) return user.user
        if(user instanceof User || user instanceof Object) return user._id
        return user
    }
}

module.exports = RoomHelper