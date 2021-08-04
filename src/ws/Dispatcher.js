const DispatcherAbstract = require("./Dispatcher/Abstract")
const DispatcherMap = require("./Dispatcher/Map")

class Dispatcher {
    static _instance = null

    /**
     * @return {null|Handler}
     */
    static get instance() {
        if(!Dispatcher._instance) Dispatcher._instance = new Dispatcher()
        return Dispatcher._instance
    }

    /**
     * @param {string} type
     * @param {Message} message
     * @param {Array} args
     */
    dispatch(type, message, args) {
        let msgDispatcher = this.getMessageDispatcher(type)
        if(msgDispatcher) {
            msgDispatcher = new msgDispatcher(message)

            if(msgDispatcher instanceof DispatcherAbstract) {
                msgDispatcher.run(...args)
            }
        }
    }

    /**
     * @param {string} type
     * @returns {null|*}
     */
    getMessageDispatcher(type) {
        if(!type) return null
        const msgDispatcher = this._getDispatchMap()[type]
        if(msgDispatcher) return msgDispatcher
        return null
    }

    _getDispatchMap() {
        return DispatcherMap
    }
}

module.exports = Dispatcher