const mongoose = require("mongoose");

const peliculaSchema = mongoose.Schema({
  codigo: { type: Number },
  nombre: { type: String },
  director: { type: String },
  protagonistas: { type: String },
  duracion: { type: String },
  trailer: { type: String },
  imagenVertical: { type: String },
  imagenHorizontal: { type: String },
  fecha_de_Estreno: { type: Number },
  sinopsis: { type: String },
  genero: { type: String },
  publicado: { type: Boolean },
  esPelicula: { type: Boolean, default: true },
  destacada: { type: Boolean, default: false },
  vista: { type: Boolean, default: false },
});
const Pelicula = mongoose.model("Pelicula", peliculaSchema);
module.exports = Pelicula;
