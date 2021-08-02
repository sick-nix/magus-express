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
     * @param {string} user
     * @param  connection
     * @return {Container}
     */
    addConnectionByUser(user, connection) {
        if(!user) throw new Error('User not set ')
        if(!connection) throw new Error('Connection not set')
        if (!this._connections[user]) this._connections[user] = []

        this._connections[user].push(connection)
        return this
    }
}

module.exports = Container