if(process.env.NODE_ENV !== 'production')
    require('dotenv').config()

exports.env = {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    SERVER_PORT: process.env.SERVER_PORT,
    WS_PORT: process.env.WS_PORT,
    MAX_ATTACHMENT_SIZE: 1000 * 1000 * 20 // 20 MB
}