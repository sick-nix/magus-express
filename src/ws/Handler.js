const HandlerAbstract = require("./Handler/Abstract")
const HandlerMap = require("./Handler/Map")

class Handler {
    static _instance = null

    /**
     * @return {null|Handler}
     */
    static get instance() {
        if(!Handler._instance) Handler._instance = new Handler()
        return Handler._instance
    }

    /**
     * @param {Message} msg
     */
    handle(msg) {
        if(!msg.getType()) return this
        let msgHandler = this.getMessageHandler(msg.getType())
        if(msgHandler) {
            msgHandler = new msgHandler(msg)

            if(msgHandler instanceof HandlerAbstract) {
                if(msgHandler.executeBeforeRun())
                    msgHandler.run()
            }
        }
    }

    /**
     * @param {string} type
     * @returns {null|*}
     */
    getMessageHandler(type) {
        if(!type) return null
        const msgHandler = this._getHandlerMap()[type]
        if(msgHandler) return msgHandler
        return null
    }

    _getHandlerMap() {
        return HandlerMap
    }
}

module.exports = Handler