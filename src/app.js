const express = require('express')
const { env } = require('./config/env')
const init = require('./loaders/index')
const app = express()

init(app)

app.listen(env.SERVER_PORT)