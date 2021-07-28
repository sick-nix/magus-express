const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    Magus.instance.setBaseUrl({
        protocol: req.protocol,
        host: req.get('host')
    })

    res.render(
    'index.ejs', {
            config: {
                baseUrl: Magus.instance.getBaseUrl(),
            }
        }
    )
})

module.exports = router