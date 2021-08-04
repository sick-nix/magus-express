const {getUserFromCookie} = require("../util/auth")
const { Server } = require('ws')
const { parseCookies } = require('../util/auth')
const Container = require('../ws/Container')
const Handler = require('../ws/Handler')
const Message = require('../ws/Message')
const _ = require('lodash')

module.exports = function (app) {
    const wss = new Server({
        port: 9000
    })

    wss.on('connection', async function (ws, req) {
        if(!(req && req.headers && req.headers.cookie)) throw new Error('Cookies not set')

        const cookies = parseCookies(req.headers.cookie)
        if(!cookies.magus) throw new Error('Magus cookie not set')
        const user = await getUserFromCookie(cookies.magus)
        if(!(user && user._id)) throw new Error('No user found from cookie')
        ws.currentUser = _.omit(user.toObject(), ['password'])
        Container.instance.addConnectionByUser(user, ws)
        ws.on('message', function (message) {
            const msg = new Message(JSON.parse(message))
            msg.setConnection(ws)
            Handler.instance.handle(msg)
            // @todo handle ws message
        })
    })
}