const router = require("express").Router();
const Usuario = require("../models/Usuario");
const CryptoJS = require("crypto-js");
const verificacion = require("./Token");
//UPDATE
router.put("/:id", verificacion, async (req, res) => {
  if (req.usuario.id === req.params.id || req.usuario.esAdmin) {
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.SECRET_KEY
      ).toString();
    }
    try {
      const usuarioModificado = await Usuario.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(usuarioModificado);
    } catch (err) {
      res.status(500).json("");
    }
  } else {
    res.status(403).json("Solo puede modificar tu cuenta");
  }
});
//BORRAR
router.delete("/:id", verificacion, async (req, res) => {
  if (req.usuario.id === req.params.id || req.usuario.esAdmin) {
    try {
      await Usuario.findByIdAndDelete(req.params.id);
      res.status(200).json("El usuaario fue borrado");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("Solo puede modificar tu cuenta");
  }
});
//OBTENER TODOS
router.get("/", verificacion, async (req, res) => {
  const query = req.query.new;
  if (req.usuario.esAdmin) {
    try {
      const usuario = query
        ? await Usuario.find().limit(20)
        : await Usuario.find();
      res.status(200).json(usuario);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("No tenes permitido ver todos los usuarios");
  }
});

//OBTENER 
router.get("/find/:id", async (req, res) => {
    
      try {
       const usuario = await Usuario.findById(req.params.id)
       const {password, ...info} = usuario._doc
        res.status(200).json(info);
      } catch (err) {
        res.status(500).json(err);
      }    
  });

module.exports = router;
