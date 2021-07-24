const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { env } = require('../config/env')
const User = require('../models/User')

async function hashPassword(req, res, next) {
    const { password } = req.body
    if(!password) return res.status(401).send()
    try {
        req.hashedPassword = await bcrypt.hash(password, 10)
        next()
    } catch (err) {
        return res.status(500).send()
    }
}

async function findUser(req, res, next) {
    const { email, password } = req.body
    if(!email) return res.status(401).send({ error: 'No email set' })

    let user
    try {
        user = await User.findOne({ email })
        if(!user)
            return res.status(404).send({ error: 'Cannot find user' })
    } catch (err) {
        return res.status(500).send({ error: err.message })
    }

    if(!await bcrypt.compare(password, user.password))
        return res.status(403).send({ error: 'Password incorrect' })

    req.user = user
    next()
}

async function checkAuth(req, res, next) {
    const token = req.cookies.magus
    if(!token) return res.status(403)

    try {
        const { _id } = jwt.verify(token, env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(_id)
        if(!user)
            return res.status(403).send()
    } catch (err) {
        return res.status(401).send()
    }

    next()
}

router.get('/', checkAuth, (req, res) => {
    res.status(200).send()
})

// register route
router.post('/register', hashPassword, async (req, res) => {
    const { hashedPassword } = req
    const {email, emailConfirm, password, passwordConfirm, username} = req.body
    if(!(email && email === emailConfirm && password && password === passwordConfirm && username))
        res.status(401).send({ error: 'Invalid registration fields' })

    const user = new User({email, password: hashedPassword, username})
    try {
        await user.save()
        res.status(201).send({ success: 'Registration successful' })
    } catch (err) {
        res.status(400).send({ error: 'There was a problem saving user' })
    }
})


// login route
router.post('/login', findUser, async (req, res) => {
    const { user } = req
    const accessToken = jwt.sign({ _id: user._id }, env.ACCESS_TOKEN_SECRET, {
        expiresIn: 60 * 60 * 24 * 7 // one week
    })
    res.cookie('magus', accessToken, {httpOnly: true})
    res.status(201).send()
})

module.exports = router