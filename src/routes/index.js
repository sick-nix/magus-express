const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    const urlParams = {
        protocol: req.protocol,
        host: req.get('host')
    }

    console.log({
        ...urlParams,
        secure: req.secure
    })
    Magus.instance.setBaseUrl(urlParams)
    Magus.instance.setWsEndpoint(urlParams)

    res.render(
    'index.ejs', {
            config: {
                baseUrl: Magus.instance.getBaseUrl(),
                wsEndpoint: Magus.instance.getWsEndpoint(),
                maxAttachmentSize: env.MAX_ATTACHMENT_SIZE
            }
        }
    )
})

module.exports = router