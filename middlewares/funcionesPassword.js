var crypto = require("crypto");

function encriptarPassword(password){
    var salt=crypto.randomBytes(32).toString("hex");
    var hash=crypto.scryptSync(password, salt, 64, "sha512").toString("hex");
    return {
        salt,
        hash
    }
}

function validarPassword(password, salt, hash){
    var hashEvaluar=crypto.scryptSync(password, salt, 64, "sha512").toString("hex");
    return hashEvaluar===hash;
}

module.exports={
    encriptarPassword,
    validarPassword
}