const path = require('path')

class Magus {
    _dbConnection = null
    static _instance = null
    _rootPath = ''
    _baseUrl = null
    _wsEndpoint = null

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

    getDir(...dir) {
        return path.join(this.getRootPath(), ...dir.map(d => d.replace(/^\/*?/, '')))
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

    /**
     * @param {Object} params
     * @param {string} params.protocol
     * @param {string} params.host
     * @returns {Magus}
     */
    setWsEndpoint(params = {}) {
        let { protocol, host } = params
        protocol = protocol === 'https' ? 'wss' : 'ws'
        host = host.replace(/:\d+/,'')
        this._wsEndpoint = protocol + '://' + host + ':' +  env.WS_PORT
        return this
    }

    getWsEndpoint() {
        return this._wsEndpoint
    }
}

module.exports = Magus