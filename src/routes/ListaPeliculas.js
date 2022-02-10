const router = require("express").Router();
const ListaPeliculas = require("../models/ListaPeliculas.js");

//CREAR
router.post("/", async (req, res) => {
  const {nombre, genero, tipo} = req.body
  const nuevaListaPeliculas = new ListaPeliculas({nombre, genero, tipo});
  try {
    const listaPeliculaGuardada = await nuevaListaPeliculas.save();
    res.status(201).json(listaPeliculaGuardada);
  } catch (err) {
    res.status(500).json(err);
  }
});

//BORRAR
router.delete("/:id", async (req, res) => {
  try {
    await ListaPeliculas.findByIdAndDelete(req.params.id);
    const listaBorrar = await ListaPeliculas.find();

    res.status(200).json({ mensaje: "La pelicula fue borrada", listaBorrar });
  } catch (err) {
    res.status(500).json(err);
  }
});

//OBTENER TODAS
router.get("/", async (req, res) => {
  try {
    const listaPeliculas = await ListaPeliculas.find();
    res.status(200).json(listaPeliculas.reverse());
  } catch (err) {
    res.status(500).json(err);
  }
});

//OBTENER SEGUN ID
router.get("/find/:id", async (req, res) => {
  try {
    const lista = await ListaPeliculas.findById(req.params.id);
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
        lista = await ListaPeliculas.aggregate([
          { $sample: { size: 10 } },
          { $match: { tipo: tipoQuery, genero: generoQuery } },
        ]);
      } else {
        lista = await ListaPeliculas.aggregate([
          { $sample: { size: 10 } },
          { $match: { tipo: tipoQuery } },
        ]);
      }
    } else {
      lista = await ListaPeliculas.aggregate([{ $sample: { size: 10 } }]);
    }
    res.status(200).json(lista);
  } catch (err) {
    res.status(500).json(err);
  }
});

//MODIFICAR
router.put("/find/:id", async (req, res) => {
  try {
    const listaPeliculasMdificada = await ListaPeliculas.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(listaPeliculasMdificada);
  } catch (err) {
    res.status(500).json(err);
  }
});

//agregar
router.post("/:idlista/agregarfilm/:idFilm", async (req, res) => {
  try {
    const idFilm = req.params.idFilm;
    const listaPeliculas = await ListaPeliculas.findById(req.params.idlista);
    listaPeliculas.contenido.push(idFilm);

    await listaPeliculas.save();
    res.status(200).json(listaPeliculas);
  } catch (err) {
    res.status(500).json(err);
  }
});

//borrar
router.delete("/:idLista/borrarfilm/:idFilm", async (req, res) => {
  try {
    const idFilm = req.params.idFilm;
    const idLista = req.params.idLista;
    const actualizado = await ListaPeliculas.findByIdAndUpdate(
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
