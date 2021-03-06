const router = require("express").Router();
const Usuario = require("../models/Usuario");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

const {
  registroValidaciones,
  userValidationResult,
} = require("../Validaciones/registroValidaciones");

const { loginValidaciones } = require("../Validaciones/loginValidaciones");

//REGISTRO
router.post(
  "/registro",
  registroValidaciones,
  userValidationResult,
  async (req, res) => {
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
  }
);

//LOGIN
router.post(
  "/login",
  loginValidaciones,
  userValidationResult,
  async (req, res) => {
    try {
      const usuario = await Usuario.findOne({ email: req.body.email });

      if (!usuario) {
       return res.status(401).json("Contraseña o email erroneo");
      }

      const bytes = CryptoJS.AES.decrypt(
        usuario.password,
        process.env.SECRET_KEY
      );
      const contraseniaOriginal = bytes.toString(CryptoJS.enc.Utf8);
      if (contraseniaOriginal !== req.body.password) {
       return res.status(402).json("Contraseña o email erroneo");
      }

      const tokenDeAcceso = jwt.sign(
        {
          id: usuario._id,
          esAdmin: usuario.esAdmin,
        },
        process.env.SECRET_KEY,
        { expiresIn: "5d" }
      );

      const { password, ...info } = usuario._doc;

      res.status(200).json({ ...info, tokenDeAcceso });
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

module.exports = router;
