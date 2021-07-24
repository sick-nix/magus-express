if(process.env.NODE_ENV !== 'production')
    require('dotenv').config()

exports.env = {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    SERVER_PORT: process.env.SERVER_PORT
}