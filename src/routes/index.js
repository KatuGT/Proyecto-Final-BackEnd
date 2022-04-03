const express = require("express");
const app = express();
const cors = require("cors");
const database = require("./database.js");
const mongoose = require("mongoose");

const filmsRoute = require("./Films");
const listafilmsRoute = require("./ListaFilms");
const autenticacionRoute = require("./Autenticacion");
const usuariosRoute = require("./Usuarios");



//middlewares
app.use(cors());
app.use(express.json());
app.use("/api/films", filmsRoute);
app.use("/api/listafilms", listafilmsRoute);
app.use("/api/aut", autenticacionRoute);
app.use("/api/usuario", usuariosRoute);

console.log("ejecutado en index js");
app.listen(process.env.PORT || 8800, () => {
  console.log(`ejecutando servidor en puerto ${process.env.PORT}`);
});
app.get("/", (req, res) => {
  console.log("ROOT");
  res.send("ROOT");
});
