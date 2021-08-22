const MagusObject = require("../util/class/Magus/Object")

class Message extends MagusObject {
    /**
     * @type {null|string}
     * @private
     */
    _type = null
    /**
     * @type {null|Object}
     * @private
     */
    _meta = null

    /**
     * @type {null|ObjectId}
     * @private
     */
    _fromUser = null

    /**
     * @type {null|WebSocket}
     * @private
     */
    _connection = null

    /**
     * @returns {Message}
     */
    constructor(msg) {
        super()

        const { type, data = {}, meta = {}, fromUser } = msg
        this.setType(type).setData(data)
        this._setMeta(new MagusObject(meta))
        this.setFromUser(fromUser)
        return this
    }

    /**
     * @param {string} type
     * @returns {Message}
     */
    setType(type) {
        this._type = type
        return this
    }

    /**
     * @returns {null|string}
     */
    getType() {
        return this._type
    }

    /**
     * @param {Object} meta
     * @returns {Message}
     * @private
     */
    _setMeta(meta) {
        this._meta = meta
        return this
    }

    /**
     * @returns {MagusObject}
     */
    getMeta() {
        return this._meta
    }

    /**
     * @param {ObjectId} fromUser
     * @returns {Message}
     */
    setFromUser(fromUser) {
        this._fromUser = fromUser
        return this
    }

    /**
     * @returns {null|ObjectId}
     */
    getFromUser() {
        return this._fromUser
    }

    /**
     * @return {null|WebSocket}
     */
    getConnection() {
        return this._connection
    }

    /**
     * @param ws
     * @return {Message}
     */
    setConnection(ws) {
        this._connection = ws
        return this
    }

    /**
     * @returns {string}
     */
    toString() {
        return JSON.stringify({
            type: this.getType(),
            data: this.getData(),
            meta: this.getMeta().getData(),
            fromUser: this.getFromUser()
        })
    }
}

module.exports = Message