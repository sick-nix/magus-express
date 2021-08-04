const _ = require('lodash')
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
     * @returns {boolean}
     */
    executeBeforeRun() {
        let executed = true
        if(this._beforeRun && Array.isArray(this._beforeRun)) {
            if(this._beforeRun.length) {
                executed = this._beforeRun.every(filter => {
                    if (_.isFunction(filter)) return (filter.bind(this))()
                    return false
                })
            }
        }

        return executed
    }

    /**
     * @return {Dispatcher}
     */
    getDispatcher() {
        return Dispatcher.instance
    }
}

module.exports = HandlerAbstract