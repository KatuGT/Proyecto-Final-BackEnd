const router = require("express").Router();
const Usuario = require("../models/Usuario");
const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');


//REGISTRO

router.post("/registro", async (req, res) => {
  console.log("llego aqui");
  const nuevoUsuario = new Usuario({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString(),
  });
  try {
    const usuario = await nuevoUsuario.save();
    res.status(201).json(usuario);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ email: req.body.email });
    !usuario && res.status(401).json("Contraseña o email erroneo");

    const bytes = CryptoJS.AES.decrypt(
      usuario.password,
      process.env.SECRET_KEY
    );
    const contraeniaOriginal = bytes.toString(CryptoJS.enc.Utf8);
    contraeniaOriginal !== req.body.password &&
      res.status(402).json("Contraseña o email erroneo");

    const tokenDeAcceso = jwt.sign(
      {
        id: usuario._id,
        esAdmin: usuario.esAdmin,
      },
      process.env.SECRET_KEY,
      { expiresIn: "5d" }
    );

    const { password, ...info } = usuario._doc;

    res.status(200).json({...info, tokenDeAcceso});
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
