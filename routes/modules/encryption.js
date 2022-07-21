const crypto = require('crypto');
const algorithm = 'aes-128-cbc';
const iv = crypto.randomBytes(16);
const key = 'privadigitalcard'

const encrypt = (text) => {
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return { iv: iv.toString('base64'), excryptedData: encrypted.toString('base64')};
}

const decrypt = (text) => {
    let iv = Buffer.from(text.iv, 'base64');
    let encryptedText = Buffer.from(text.excryptedData, 'base64');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted.toString('utf8');
}

module.exports = {
    encrypt,
    decrypt
}