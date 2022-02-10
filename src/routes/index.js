const express = require("express");
const app = express();
const cors = require("cors");
const database = require("./database.js");
const dotenv = require("dotenv");
const peliculaRoute = require("./Peliculas");
const listaPeliculaRoute = require("./ListaPeliculas");

dotenv.config();

//middlewares
app.use(cors());
app.use(express.json());
app.use("/api/peliculas", peliculaRoute);
app.use("/api/listapeliculas", listaPeliculaRoute);

console.log("ejecutado en index js");
app.listen(process.env.PORT || 8800, () => {
  console.log(`ejecutando servidor en puerto ${process.env.PORT}`);
});
app.get("/", (req, res) => {
  console.log("ROOT");
  res.send("ROOT");
});
