const crypto = require("crypto");

function encryptAES(plainText, key, outputEncoding = "base64") {
    const cipher = crypto.createCipheriv("aes-128-ecb", key, null);
    return Buffer.concat([cipher.update(plainText), cipher.final()]).toString(outputEncoding);
}

function decryptAES(cipherText, key, outputEncoding = "utf8") {
    const cipher = crypto.createDecipheriv("aes-128-ecb", key, null);
    return Buffer.concat([cipher.update(cipherText), cipher.final()]).toString(outputEncoding);
}

module.exports = {
  encryptAES,
  decryptAES
}