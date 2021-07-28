const express = require('express')
const { env } = require('./config/env')
const init = require('./loaders/index')
const Magus = require('./Magus')
const app = express()

global.Magus = Magus
global.env = env
Magus.instance.setRootPath(__dirname)
init(app)

app.listen(env.SERVER_PORT)