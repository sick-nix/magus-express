const Room = require('../../models/Room')
const RoomUser = require('../../models/RoomUser')
const User = require('../../models/User')
const DbHelper = require('../db')
const _ = require('lodash')
const {ROOM_TYPES} = require("../../constants/chat")
const mongoose = require('mongoose')

const RoomHelper = {
    /**
     * @param {Room|string|Object} room
     * @return {Promise<Array>}
     */
    async getUsersByRoom(room) {
        let roomId = room
        if(room instanceof Room || (room instanceof Object && room._id))
            roomId = room._id

        try {
            const usersByRoom = DbHelper.getArrayOfField(await RoomUser.find({ room: roomId }), 'user')
            const users = await User.find({ _id: { '$in': usersByRoom}})
            if(users) return DbHelper.getArrayOfField(users, ['_id', 'username', 'avatar', 'email'])
        } catch (err) {
            console.error(err)
        }

        return []
    },
    /**
     * @param {User} user
     * @return {Promise<Array>}
     */
    async getRoomsByUser(user) {
        const userId = this._getUserId(user)
        if(!userId) return []

        try {
            const roomIds = DbHelper.getArrayOfField(await this.getAllUserRoomRelations(user), 'room')
            let rooms = await Room.find({'_id': {'$in': roomIds}})
            if(!rooms) return []

            rooms = await Promise.all(rooms.map(async room => {
                const users = await this.getUsersByRoom(room)
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
     * @return {ObjectId}
     * @private
     */
    _getUserId(user) {
        if(user instanceof RoomUser) return mongoose.Types.ObjectId(user.user)
        if(user instanceof User || user instanceof Object) return mongoose.Types.ObjectId(user._id)
        return mongoose.Types.ObjectId(user)
    },
    /**
     * @param {User} user
     * @return {Promise<Object>}
     */
    async getUserLastMessageCount(user) {
        const userId = this._getUserId(user)

        try {
            const roomsUsers = await RoomUser.find({user: userId})
            const result = {}
            for(const roomUser of roomsUsers) result[roomUser.room] = roomUser.lastMessageCount
            return result
        } catch (err) {
            console.error(err)
        }

        return {}
    },
    /**
     * @param {Room} room
     * @param {User} user
     * @return {Promise<boolean>}
     */
    async isUserActiveInRoom(room, user) {
        return Boolean((await this.getRoomUserRelation(room, user)).activeInRoom)
    },
    /**
     * @param {Room} room
     * @param {User} user
     * @param {Boolean} activeInRoom
     * @return {Promise<boolean>}
     */
    async setUserActiveInRoom(room, user, activeInRoom) {
        const relation = await this.getRoomUserRelation(room, user)
        relation.activeInRoom = activeInRoom
        relation.lastMessageCount = room.messageCount
        try {
            await relation.save()
            return true
        } catch (err) {
            console.error(err)
            return false
        }
    },
    /**
     * @param {User} user
     * @return {Promise<Array>}
     */
    getAllUserRoomRelations(user) {
        const userId = this._getUserId(user)
        return RoomUser.find({user: userId})
    },
    /**
     * @param {Room} room
     * @param {User} user
     * @return {RoomUser}
     */
    getRoomUserRelation(room, user) {
        return RoomUser.findOne({room: room._id, user: user._id})
    },
    /**
     * @param {User|Object} user
     * @return {*}
     */
    setUserInactiveInRooms(user) {
        return this.getAllUserRoomRelations(user).where({activeInRoom: true}).updateMany({}, {activeInRoom: false})
    },
    /**
     * @param {Array} users
     * @return {null|ObjectId}
     */
    async getDirectRoomByUserPair(users) {
        if(!(_.isArray(users) && users.length === 2)) return null

        // normalize array of users to array of user ids
        users = users.map(user => this._getUserId(user))

        let room = await RoomUser.aggregate([
            { $match: { room_type: ROOM_TYPES.DIRECT, user: { '$in': users } } },
            { $group: { _id: '$room', total: { $sum: 1 } } },
            { $match: { total: 2 } }
        ])

        // aggregate will return an array, check if it has any elements
        if(!(room && _.isArray(room) && room.length > 0)) return null
        // get _id of first element
        room = room[0]._id

        room = await Room.findById(room)
        return room
    },
    /**
     * @param {Room|Object} room
     * @param {Object} params
     * @return {Promise<RoomHelper>}
     */
    async prepareRoom(room, params = {}) {
        const { currentUser } = params
        if(room.type === ROOM_TYPES.DIRECT) {
            const users = await this.getUsersByRoom(room)
            const otherUser = users.find(user => user._id.toString() !== currentUser._id.toString())
            const relation = await this.getRoomUserRelation(room, currentUser)
            if(otherUser)
                room.name = otherUser.username
            if(relation)
                room.hidden = relation.hidden
        }

        return this
    },
    /**
     * @param {Room|Object} room
     * @param {User|Object} user
     * @param {boolean} hidden
     * @return {Promise<RoomHelper>}
     */
    async setHiddenForRelation(room, user, hidden = false) {
        const roomRelation = await this.getRoomUserRelation(room, user)
        if(!roomRelation) return this

        try {
            roomRelation.hidden = hidden
            if(hidden)
                roomRelation.activeInRoom = false
            await roomRelation.save()
        } catch (err) {
            console.error(err)
        }

        return this
    },
    /**
     * @param {Room|Object} room
     * @return {Promise<{users: *[], room}>}
     */
    async deleteRoom(room) {
        room = await Room.findById(mongoose.Types.ObjectId(room._id))
        let users = []
        try {
            users = await this.getUsersByRoom(room)
        } catch (err) {
            console.error(err)
        }

        await room.deleteOne()
        return {
            users,
            room
        }
    }
}

module.exports = RoomHelper