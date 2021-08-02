const jwt = require('jsonwebtoken')
const User = require('../models/User')

module.exports.parseCookies = function (str) {
    return str
        .split(';')
        .map(v => v.split('='))
        .reduce((acc, v) => {
            acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim())
            return acc
        }, {})
}

/**
 * @param {string} cookie
 * @return {Promise<*|null>}
 */
module.exports.getUserFromCookie = async function (cookie) {
    const token = cookie

    let user
    try {
        const { _id } = jwt.verify(token, env.ACCESS_TOKEN_SECRET)
        user = await User.findById(_id)
        if(!user) return null
    } catch (err) {
        return null
    }

    return user
}