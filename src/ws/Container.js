const Message = require('./Message')
const RoomHelper = require('../util/helper/Room')
const RoomUser = require('../models/RoomUser')
const User = require('../models/User')

class Container {
    /**
     * @type {null|Container}
     * @private
     */
    static _instance = null
    /**
     * @type {Object}
     * @private
     */
    _connections = {}

    /**
     * @return {Container}
     */
    static get instance() {
        if(!Container._instance) Container._instance = new Container()
        return Container._instance
    }

    /**
     * @return {Object}
     */
    getConnections() {
        return this._connections
    }

    /**
     * @param {string|RoomUser|User} user
     * @param {WebSocket} connection
     * @return {Container}
     */
    addConnectionByUser(user, connection) {
        if(!user) throw new Error('User not set ')
        if(!connection) throw new Error('Connection not set')
        const userId = RoomHelper._getUserId(user)
        if (!this._connections[userId]) this._connections[userId] = []

        this._connections[userId].push(connection)
        return this
    }

    /**
     *
     * @param {string|RoomUser|User} user
     * @param {WebSocket} connection
     * @return {Container}
     */
    removeConnectionByUser(user, connection) {
        if(!user) throw new Error('User not set ')
        if(!connection) throw new Error('Connection not set')
        const userId = RoomHelper._getUserId(user)
        if (!this._connections[userId]) return this

        this._connections[userId].splice(connection, -1)
        return this
    }

    /**
     * @param {string|RoomUser|User} user
     * @return {Array}
     */
    getConnectionsByUser(user) {
        const userId = RoomHelper._getUserId(user)
        return this.getConnections()[userId]
    }

    /**
     * @param {string|RoomUser|User} user
     * @return {number}
     */
    getCountByUser(user) {
        const userId = RoomHelper._getUserId(user)
        if(userId && this._connections[userId]) return this._connections[userId].length
        return 0
    }

    /**
     * @param {Message|string} message
     * @param {Array} users
     * @return {Container}
     */
    async sendToUsers(message, users) {
        let userId = null
        for(const user of users) {
            message.getMeta().addData({
                'lastMessageCount': await RoomHelper.getUserLastMessageCount(user)
            })
            userId = RoomHelper._getUserId(user)

            const connections = this.getConnectionsByUser(userId)
            if(connections && connections.length) {
                for(const conn of connections) {
                    conn.send(this._getJsonMessage(message))
                }
            }
        }

        return this
    }

    /**
     * @param {string|Message} message
     * @return {string}
     * @private
     */
    _getJsonMessage(message) {
        if(message instanceof Message) return message.toString()
        return message
    }
}

module.exports = Container