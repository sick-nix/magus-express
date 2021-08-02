const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    const urlParams = {
        protocol: req.protocol,
        host: req.get('host')
    }
    Magus.instance.setBaseUrl(urlParams)
    Magus.instance.setWsEndpoint(urlParams)

    res.render(
    'index.ejs', {
            config: {
                baseUrl: Magus.instance.getBaseUrl(),
                wsEndpoint: Magus.instance.getWsEndpoint()
            }
        }
    )
})

module.exports = router