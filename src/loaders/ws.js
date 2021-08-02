const {getUserFromCookie} = require("../util/auth")
const { Server } = require('ws')
const { parseCookies } = require('../util/auth')
const Container = require('../ws/Container')

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
        Container.instance.addConnectionByUser(user, ws)
        ws.on('message', function (message) {
            // @todo handle ws message
        })
    })
}