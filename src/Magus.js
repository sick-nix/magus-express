class Magus {
    _dbConnection = null
    static _instance = null

    /**
     * @returns {Magus}
     */
    static get instance() {
        if(!Magus._instance) Magus._instance = new Magus()
        return Magus._instance
    }

    setDbConnection(conn) {
        this._dbConnection = conn
        return this
    }

    getDbConnection() {
        return this._dbConnection
    }
}

module.exports = Magus