const router = require("express").Router();
const Pelicula = require("../models/Pelicula");
const ListaPeliculas = require("../models/ListaPeliculas");

//CREAR
router.post("/", async (req, res) => {
  const nuevaPelicula = new Pelicula(req.body);
  nuevaPelicula.genero = nuevaPelicula.genero.toLowerCase();
  try {
    const peliculaGuardada = await nuevaPelicula.save();
    res.status(201).json(peliculaGuardada);
  } catch (err) {
    res.status(500).json(err);
  }
});

//MODIFICAR
router.put("/:id", async (req, res) => {
  try {
    const peliculaModificada = await Pelicula.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(peliculaModificada);
  } catch (err) {
    res.status(500).json(err);
  }
});

//BORRAR
router.delete("/:id", async (req, res) => {
  try {
    await Pelicula.findByIdAndDelete(req.params.id);
    const listas = await ListaPeliculas.find({ contenido: req.params.id });
    for (const lista of listas) {
      lista.contenido = lista.contenido.filter(
        (elemento) => elemento !== req.params.id
      );
      console.log(lista.contenido);
      await lista.save();
    }
    res.status(200).json("La pelicula fue borrada");
  } catch (err) {
    res.status(500).json(err);
  }
});

//OBTENER TODAS
router.get("/", async (req, res) => {
  try {
    const peliculas = await Pelicula.find();
    res.status(200).json(peliculas.reverse());
  } catch (err) {
    res.status(500).json(err);
  }
});

//OBTENER SEGUN ID
router.get("/:id", async (req, res) => {
  try {
    const pelicula = await Pelicula.findById(req.params.id);
    res.status(200).json(pelicula);
  } catch (err) {
    res.status(500).json(err);
  }
});

//OBTENER RANDOM
router.get("/random", async (req, res) => {
  const tipo = req.query.type;
  let pelicula;
  try {
    if (tipo === "series") {
      movie = await Pelicula.aggregate([
        { $match: { esPelicula: false } },
        { $sample: { size: 7 } },
      ]);
    } else {
      pelicula = await Pelicula.aggregate([
        { $match: { isSeries: true } },
        { $sample: { size: 7 } },
      ]);
    }
    res.status(200).json(pelicula);
  } catch (err) {
    res.status(500).json(err);
  }
});

//OBTENER segun genero
router.get("/filtro/:tipo/:genero", async (req, res) => {
  try {
    const tipo = req.params.tipo.toLowerCase() === "pelicula";
    const busquedaGenero = req.params.genero.toLowerCase();
    const peliculaFiltrada = await Pelicula.find({
      esPelicula: tipo,
      genero: busquedaGenero,
    });
    res.status(200).json(peliculaFiltrada);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
