const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { checkAuth } = require('../middleware/auth')
const _ = require('lodash')

router.get('/', async (req, res) => {
    const { email, username } = req.query
    const filter = {}
    if(email)
        filter.email = new RegExp('^' + email + '$')
    else if(username)
        filter.username = new RegExp('^' + username + '$')
    try {
        const user = await User.findOne(filter)
        res.status(200).send({ available: !user })
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

router.get('/users', checkAuth, async (req, res) => {
    const { username = '', excludeCurrentUser } = req.query
    const { user } = req
    const filter = {username: new RegExp(username)}
    if(Boolean(excludeCurrentUser)) filter._id = { '$ne': user._id }
    try {
        let users = await User.find(filter).limit(50)
        console.log(users)
        users = users.map(u => _.omit(u, ['password']))
        console.log(users)
        res.status(200).send(users)
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

module.exports = router