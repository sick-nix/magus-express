const express = require('express')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const initRoutes = require('./routes')
const cors = require('cors')

module.exports = async function (app) {
    // add json support
    app.use(express.json())
    // add cookie parser
    app.use(cookieParser())

    app.use(cors({
        origin: '*',
        credentials: true,
    }))

    // set view engine to ejs
    app.set('view-engine', 'ejs')
    app.set('views', Magus.instance.getDir('views'))

    // connect to db
    await mongoose.connect(env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })

    initRoutes(app)
}