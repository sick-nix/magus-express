const v = require('voca')

class Manager {
    static MANAGER_NAME = 'Handler'
    static _instance = null

    /**
     * @return {null|Handler}
     */
    static get instance() {
        if(!this._instance) this._instance = new this()
        return this._instance
    }

    /**
     * @param {Message} msg
     * @return {Object}
     */
    async manage(msg) {
        if(!msg.getType()) throw new Error('Cannot manage message without type')
        const parts = msg.getType().split(/[.:]/)
        let classOne = '', classTwo = null, method = 'run'
        switch (parts.length) {
            case 1:
                classOne = parts[0]
                break
            case 2:
                if(msg.getType().indexOf('.') > 0) {
                    classOne = parts[0]
                    classTwo = parts[1]
                } else {
                    classOne = parts[0]
                    method = parts[1]
                }
                break
            case 3:
                classOne = parts[0]
                classTwo = parts[1]
                method = parts[2]
                break
            default: throw new Error(`Invalid Message Type: ${msg.getType()}`)
        }

        let classPath = v.capitalize(classOne, true)
        if(classTwo) classPath += `/${v.capitalize(classTwo, true)}`
        const path = `./${this.constructor.MANAGER_NAME}/${classPath}.js`
        const { default: klass } = await import(path)

        if(!klass) throw new Error(`Could not find file to import: ${path}`)
        const instance = new klass(msg)

        return {instance, method}
    }
}

module.exports = Manager