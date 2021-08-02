const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    ownerUser: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

roomSchema.pre('save', function (next) {
    if(this._id) this.updatedAt = Date.now
    next()
})

module.exports = mongoose.model('Room', roomSchema)