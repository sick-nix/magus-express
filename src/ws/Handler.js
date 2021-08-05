const HandlerAbstract = require('./Handler/Abstract')
const Manager = require('./Manager')
const _ = require('lodash')

class Handler extends Manager {
    static MANAGER_NAME = 'Handler'

    /**
     * @param {Message} msg
     * @return {Handler}
     */
    async handle(msg) {
        const { instance, method } = await this.manage(msg)

        if(!instance instanceof HandlerAbstract)
            throw new Error(`Message handler has to be instance of HandlerAbstract, instead ${instance.constructor} passed`)
        if(!_.isFunction(instance[method]))
            throw new Error(`Method ${method} doesn't exist in class ${instance.constructor}`)

        if(this.executeBeforeRun(instance, msg))
            instance[method]()

        return this
    }

    /**
     * @param {HandlerAbstract} instance
     * @param {Message} msg
     * @return {boolean}
     */
    executeBeforeRun(instance, msg) {
        return instance._beforeRun.every(filter => filter.bind(instance)())
    }
}

module.exports = Handler