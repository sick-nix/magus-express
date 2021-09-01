const express = require('express')
const http = require('http')
const { env } = require('./config/env')
const Magus = require('./Magus')
global.Magus = Magus
global.env = env
Magus.instance.setRootPath(__dirname)

const init = require('./loaders/index')
const app = express()
const server = http.createServer(app)

app.server = server
init(app)

app.listen(env.PORT)