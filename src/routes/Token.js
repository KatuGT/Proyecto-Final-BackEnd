const jwt = require('jsonwebtoken');

function  verificacion(req, res, next){
const autHeaders = req.headers.token
if(autHeaders){   
    jwt.verify(autHeaders, process.env.SECRET_KEY, (err, usuario)=>{
        if(err) res.status(403).json("El token no es valido")
        req.usuario = usuario
        next()
    })
}else{
    return res.status(401).json("No estas autentificado")
}
}

module.exports = verificacion