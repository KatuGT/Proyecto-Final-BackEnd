const router = require("express").Router();
const ListaFilms = require("../models/ListasFilms.js");


//CREAR
router.post("/", async (req, res) => {
  const {nombre, genero, tipo} = req.body
  const nuevaListaFilms = new ListaFilms({nombre, genero, tipo});
  try {
    const listaFilmsGuardada = await nuevaListaFilms.save();
    res.status(201).json(listaFilmsGuardada);
  } catch (err) {
    res.status(500).json(err);
  }
});

//BORRAR
router.delete("/:id", async (req, res) => {
  try {
    await ListaFilms.findByIdAndDelete(req.params.id);
    const listaBorrar = await ListaFilms.find();

    res.status(200).json({ mensaje: "La pelicula fue borrada", listaBorrar });
  } catch (err) {
    res.status(500).json(err);
  }
});

//OBTENER TODAS
router.get("/", async (req, res) => {
  try {
    const listaFilms = await ListaFilms.find();
    res.status(200).json(listaFilms.reverse());
  } catch (err) {
    res.status(500).json(err);
  }
});

//OBTENER SEGUN ID
router.get("/find/:id", async (req, res) => {
  try {
    const lista = await ListaFilms.findById(req.params.id);
    res.status(200).json(lista);
  } catch (err) {
    res.status(500).json(err);
  }
});

// OBTENER SEGUN TIPO
router.get("/filterList", async (req, res) => {
  const tipoQuery = req.query.tipo;
  const generoQuery = req.query.genero;
  let lista = [];
  try {
    if (tipoQuery) {
      if (generoQuery) {
        lista = await ListaFilms.aggregate([
          { $sample: { size: 10 } },
          { $match: { tipo: tipoQuery, genero: generoQuery } },
        ]);
      } else {
        lista = await ListaFilms.aggregate([
          { $sample: { size: 10 } },
          { $match: { tipo: tipoQuery } },
        ]);
      }
    } else {
      lista = await ListaFilms.aggregate([{ $sample: { size: 10 } }]);
    }
    res.status(200).json(lista);
  } catch (err) {
    res.status(500).json(err);
  }
});

//MODIFICAR
router.put("/find/:id", async (req, res) => {
  try {
    const listaFilmsMdificada = await ListaFilms.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(listaFilmsMdificada);
  } catch (err) {
    res.status(500).json(err);
  }
});

//agregar film a lista 
router.post("/:idlista/agregarfilm/:idFilm", async (req, res) => {
  try {
    const idFilm = req.params.idFilm;
    const listaFilms = await ListaFilms.findById(req.params.idlista);
    listaFilms.contenido.push(idFilm);

    await listaFilms.save();
    res.status(200).json(listaFilms);
  } catch (err) {
    res.status(500).json(err);
  }
});

//borrar
router.delete("/:idLista/borrarfilm/:idFilm", async (req, res) => {
  try {
    const idFilm = req.params.idFilm;
    const idLista = req.params.idLista;
    const actualizado = await ListaFilms.findByIdAndUpdate(
      idLista,
      { $pullAll: { contenido: [idFilm] } },
      { new: true }
    );
    res.status(200).json(actualizado);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

module.exports = router;
