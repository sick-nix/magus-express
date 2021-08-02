const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { checkAuth } = require('../middleware/auth')
const _ = require('lodash')

async function hashPassword(req, res, next) {
    const { password } = req.body
    if(!password) return res.status(401).send()
    try {
        req.hashedPassword = await bcrypt.hash(password, 10)
    } catch (err) {
        return res.status(500).send()
    }

    next()
}

async function findUser(req, res, next) {
    const { email, password } = req.body

    let user
    try {
        user = await User.findOne({ email })
        if(!user)
            return res.status(403).send({ error: 'Email or password incorrect' })
    } catch (err) {
        return res.status(500).send({ error: err.message })
    }

    if(!await bcrypt.compare(password, user.password))
        return res.status(403).send({ error: 'Email or password incorrect' })

    req.user = user
    next()
}

router.get('/', checkAuth, (req, res) => {
    const {user} = req
    res.status(200).send(_.omit(user.toObject(), ['password']))
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
    // @todo restore
    res.cookie('magus', accessToken, {})//{httpOnly: true, sameSite: true})
    res.status(200).send(_.omit(user.toObject(), ['password']))
})

router.delete('/logout', (req, res) => {
    res.clearCookie('magus')
    res.status(200).send()
})

module.exports = router