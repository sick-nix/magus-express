const indexRouter = require('../routes/index')
const authRouter = require('../routes/auth')
const userRouter = require('../routes/user')

module.exports = function (app) {
    app.use('/', indexRouter)
    app.use('/auth', authRouter)
    app.use('/user', userRouter)
}