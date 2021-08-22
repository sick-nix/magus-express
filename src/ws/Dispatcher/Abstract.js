const Container = require('../Container')
const Message = require('../Message')

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

    /**
     * @return {Dispatcher}
     */
    getDispatcher() {
        const Dispatcher = require('../Dispatcher')
        return Dispatcher.instance
    }

    /**
     * @param {Object} data
     * @param {Message|null} originalMessage
     * @return {Message}
     */
    createMessage(data, originalMessage= null) {
        if(!originalMessage)
            originalMessage = this.getMessage()

        return new Message({
            ...data,
            fromUser: originalMessage.getConnection().currentUser._id
        })
    }
}

module.exports = DispatcherAbstract