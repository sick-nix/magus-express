const express = require('express')
const router = express.Router()
const { checkAuth } = require('../middleware/auth')
const UploadHelper = require('../util/helper/Upload')
const AttachmentHelper = require('../util/helper/Attachment')
const Attachment = require('../models/Attachment')
const fs = require('fs')
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        file.magusFileName = UploadHelper.getRandomFilename()
        file.magusDestination = UploadHelper.getDestinationFolder(file.magusFileName)
        UploadHelper.createDir(file.magusDestination)
        cb(null, file.magusDestination)
    },
    filename: function (req, file, cb) {
        cb(null, file.magusFileName)
    },
})
const upload = multer({
    storage,
    limits: {
        fileSize: env.MAX_ATTACHMENT_SIZE
    }
}).single('file')

router.post('/upload', checkAuth, async (req, res) => {
    upload(req, res, async function (err) {
        const { uniq } = req.body
        if(err) {
            console.error(err)
            res.status(500).send({error: 'There was an error uploading attachment'})
        } else {
            const attachment = await AttachmentHelper.createAttachment(uniq, req.file, req.user)
            if(attachment) {
                res.status(201).send(attachment.toObject())
            } else {
                res.status(500).send({error: 'There was an error saving attachment'})
            }
        }
    })
})

router.get('/download', async (req, res) => {
    const attachment = await Attachment.findById(req.query.id)
    const path = AttachmentHelper.getPath(attachment.filePath)
    if(fs.existsSync(path))
        res.download(path, attachment.origFilename)
    else
        res.status(404).send({ error: 'File doesn\'t exist'})
})

router.get('/*', checkAuth, (req, res) => {
    const path = AttachmentHelper.getPath(req.url)
    if(fs.existsSync(path))
        res.sendFile(path)
    else
        res.status(404).send()
})

module.exports = router