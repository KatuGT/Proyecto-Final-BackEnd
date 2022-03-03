const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fotoPerfil: { type: String, default: "" },
  esAdmin: { type: Boolean, default: false },
  estaActivo: { type: Boolean, default: true },
});



const Usuario = mongoose.model(
    "Usuario",
    UsuarioSchema
  );
  module.exports = Usuario;

