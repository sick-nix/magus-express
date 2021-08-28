const crypto = require('crypto')
const path = require('path')
const fs = require('fs');

const UploadHelper = {
    getRandomFilename() {
        return crypto.randomBytes(20).toString('hex')
    },
    getDispertionPath(filename) {
        return filename.substr(0, 2).split('').join('/') + '/'
    },
    getDestinationFolder(filename) {
        return Magus.instance.getDir(path.join('../media', this.getDispertionPath(filename)))
    },
    createDir(dir) {
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
    }
}

module.exports = UploadHelper