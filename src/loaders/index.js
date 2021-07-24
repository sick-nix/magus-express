const express = require('express')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const { env } = require('../config/env')
const Magus = require('../Magus')
const initRoutes = require('./routes')

module.exports = async function (app) {
    app.use(express.json())
    app.use(cookieParser())

    await mongoose.connect(env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    Magus.instance.setDbConnection(mongoose.connection)

    initRoutes(app)
}