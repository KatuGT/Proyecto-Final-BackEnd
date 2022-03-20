const router = require("express").Router();
const Films = require("../models/Films");
const ListaFilms = require("../models/ListasFilms");

//CREAR
router.post("/", async (req, res) => {
  const nuevoFilm = new Films(req.body);
  nuevoFilm.genero = nuevoFilm.genero.toLowerCase();
  try {
    const filmGuardado = await nuevoFilm.save();
    res.status(201).json(filmGuardado);
  } catch (err) {
    res.status(500).json(err);
  }
});

//MODIFICAR
router.put("/:id", async (req, res) => {
  try {
    const filmModificado = await Films.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(filmModificado);
  } catch (err) {
    res.status(500).json(err);
  }
});

//BORRAR
router.delete("/:id", async (req, res) => {
  try {
    await Films.findByIdAndDelete(req.params.id);
    const listas = await ListaFilms.find({ contenido: req.params.id });
    for (const lista of listas) {
      lista.contenido = lista.contenido.filter(
        (elemento) => elemento !== req.params.id
      );
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
    const films = await Films.find();
    res.status(200).json(films.reverse());
  } catch (err) {
    res.status(500).json(err);
  }
});

//OBTENER SEGUN ID
router.get("/:id", async (req, res) => {
  try {
    const films = await Films.findById(req.params.id);
    res.status(200).json(films);
  } catch (err) {
    res.status(500).json(err);
  }
});

//OBTENER RANDOM
router.get("/random/seven", async (req, res) => {
  const tipo = req.query.type;
  let film;
  try {
    if (tipo === "series") {
      movie = await Films.aggregate([
        { $match: { esPelicula: false } },
        { $sample: { size: 7 } },
      ]);
    } else {
      film = await Films.aggregate([
        { $match: { isSeries: true } },
        { $sample: { size: 7 } },
      ]);
    }
    res.status(200).json(film);
  } catch (err) {
    res.status(500).json(err);
  }
});

//OBTENER segun genero
router.get("/filtro/:tipo/:genero", async (req, res) => {
  try {
    const tipo = req.params.tipo.toLowerCase() === "pelicula";
    const busquedaGenero = req.params.genero.toLowerCase();
    const filmFiltrado = await Films.find({
      esPelicula: tipo,
      genero: busquedaGenero,
    });
    res.status(200).json(filmFiltrado);
  } catch (err) {
    res.status(500).json(err);
  }
});


//agregar comentario
router.post("/:idfilm/agregarcomentario", async (req, res) => {
  try {
    const value = req.body.value;
    const comentarioFilms = await Films.findById(req.params.idfilm);
    comentarioFilms.comentarios.push(value);

    await comentarioFilms.save();
    res.status(200).json(comentarioFilms);
  } catch (err) {
    res.status(500).json(err);
    console.log("fallo comentario");
  }
});

module.exports = router;
