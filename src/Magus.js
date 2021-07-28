class Magus {
    _dbConnection = null
    static _instance = null
    _rootPath = null
    _baseUrl = null

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

    setRootPath(rootPath) {
        this._rootPath = rootPath
        return this
    }

    getRootPath() {
        return this._rootPath
    }

    getDir(path) {
        return this.getRootPath() + '/' + path.replace(/^\/*?/, '')
    }

    /**
     * @param {Object} params
     * @param {string} params.protocol
     * @param {string} params.host
     * @returns {Magus}
     */
    setBaseUrl(params = {}) {
        const { protocol, host } = params
        this._baseUrl = protocol + '://' + host
        return this
    }

    getBaseUrl() {
        return this._baseUrl
    }
}

module.exports = Magus