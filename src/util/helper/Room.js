const Room = require('../../models/Room')
const RoomUser = require('../../models/RoomUser')
const User = require('../../models/User')
const DbHelper = require('../db')

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
            const usersByRoom = DbHelper.getArrayOfField(await RoomUser.find({ room: roomId }), 'user')
            const users = await User.find({ _id: { '$in': usersByRoom}})
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
            const roomIds = DbHelper.getArrayOfField(await RoomUser.find({user: userId}), 'room')
            let rooms = await Room.find({'_id': {'$in': roomIds}})
            if(!rooms) return []

            rooms = await Promise.all(rooms.map(async room => {
                const users = DbHelper.getArrayOfField(await RoomUser.find({room: room._id}))
                return {
                    ...room.toObject(),
                    users
                }
            }))

            return rooms
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