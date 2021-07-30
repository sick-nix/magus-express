const jwt = require('jsonwebtoken')
const User = require('../models/User')

async function checkAuth(req, res, next) {
    const token = req.cookies.magus

    let user
    try {
        const { _id } = jwt.verify(token, env.ACCESS_TOKEN_SECRET)
        user = await User.findById(_id)
        if(!user)
            return res.status(403).send()
    } catch (err) {
        return res.status(401).send()
    }

    req.user = user
    next()
}

module.exports = {
    checkAuth
}