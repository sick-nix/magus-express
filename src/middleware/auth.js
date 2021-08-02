const {getUserFromCookie} = require("../util/auth")

async function checkAuth(req, res, next) {
    const token = req.cookies.magus

    const user = await getUserFromCookie(token)
    if(!user) return res.status(403).send()

    req.user = user
    next()
}

module.exports = {
    checkAuth
}