const Manager = require('./Manager')
const Message = require('./Message')
const DispatcherAbstract = require('./Dispatcher/Abstract')
const _ = require('lodash')

class Dispatcher extends Manager {
    static MANAGER_NAME = 'Dispatcher'

    /**
     * @param {string} type
     * @param {Message} message
     * @param {Array} args
     */
    async dispatch(type, message, args) {
        const { instance, method } = await this.manage(new Message({type}))
        instance.setMessage(message)

        if(!instance instanceof DispatcherAbstract)
            throw new Error(`Message dispatcher has to be instance of DispatcherAbstract, instead ${instance.constructor} passed`)
        if(!_.isFunction(instance[method]))
            throw new Error(`Method ${method} doesn't exist in class ${instance.constructor}`)

        instance[method](...args)

        return this
    }
}

module.exports = Dispatcher