const Dispatcher = require('../Dispatcher')

class HandlerAbstract {
    _beforeRun = []
    _message = null

    /**
     * @param {Message} msg
     * @returns {HandlerAbstract}
     */
    constructor(msg) {
        this.setMessage(msg)
        return this
    }

    run() {
        return this
    }

    /**
     * @param {Message} msg
     * @returns {HandlerAbstract}
     */
    setMessage(msg) {
        this._message = msg
        return this
    }

    /**
     * @returns {null|Message}
     */
    getMessage() {
        return this._message
    }

    /**
     * @return {Dispatcher}
     */
    getDispatcher() {
        return Dispatcher.instance
    }
}

module.exports = HandlerAbstract