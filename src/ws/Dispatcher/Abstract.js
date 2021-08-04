const Container = require('../Container')

class DispatcherAbstract {
    _message = null

    /**
     * @param {Message} msg
     * @returns {DispatcherAbstract}
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
     * @returns {DispatcherAbstract}
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
     * @return {Container}
     */
    getContainer() {
        return Container.instance
    }
}

module.exports = DispatcherAbstract