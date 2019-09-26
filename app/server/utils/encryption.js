const crypto = require('crypto')
module.exports = {
    generateSalt : function (){
        return crypto.randomBytes(128).toString('base64')
    },
    encryptor : function (password, salt) {
        let hmac = crypto.createHmac('sha1', salt)
        return hmac.update(password).digest('hex')
    }
}