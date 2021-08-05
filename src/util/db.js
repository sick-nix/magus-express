const DbHelper = {
    getArrayOfField(collection, field = '_id') {
        return collection.map(el => {return el[field]})
    }
}

module.exports = DbHelper