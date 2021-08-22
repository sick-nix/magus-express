const _ = require('lodash')

class MagusObject {
    _data = null

    constructor(data = {}) {
        this.setData(data)

        return new Proxy(this, this.getProxyHandler())
    }

    /**
     * @param {string|null} key
     * @returns {Object|*}
     */
    getData(key = null) {
        if(key) return this._data[key]
        return this._data
    }

    /**
     * @param {String|Object} key
     * @param {*} value
     * @returns {MagusObject}
     */
    setData(key, value = null) {
        if(key instanceof Object) this._data = key
        else this._data[key] = value

        return this
    }

    /**
     * @param {Object} data
     * @returns {MagusObject}
     */
    addData(data) {
        this._data = _.merge(this._data, data)
        return this
    }

    /**
     * @param {string} key
     * @returns {MagusObject}
     */
    unsetData(key) {
        delete this._data[key]
        return this
    }

    getProxyHandler() {
        return this._getDefaultProxyHandler()
    }

    _getDefaultProxyHandler() {
        return {
            get: function (obj, prop) {
                if(_.isFunction(obj[prop]))
                    return obj[prop].bind(obj)
                if(obj.getData(prop) !== undefined)
                    return obj.getData(prop)
                return Reflect.get(obj, prop)
            },
            set: function (obj, prop, value) {
                return obj.setData(prop, value)
            }
        }
    }
}

module.exports = MagusObject