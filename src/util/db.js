const _ = require('lodash')

const DbHelper = {
    getArrayOfField(collection, field = '_id') {
        return collection.map(el => {
            if(_.isString(field)) return el[field]
            return _.pick(el, field)
        })
    }
}

module.exports = DbHelper