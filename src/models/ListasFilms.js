const mongoose = require("mongoose");

const listaFilmsSchema = mongoose.Schema({
  nombre: { type: String, required: true },
  genero: { type: String },
  tipo: { type: String },
  contenido: { type: Array }  
});

const ListaFilms = mongoose.model(
  "ListaFilms",
  listaFilmsSchema
);
module.exports = ListaFilms;
