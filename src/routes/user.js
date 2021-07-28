const express = require('express')
const router = express.Router()
const User = require('../models/User')

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

module.exports = router