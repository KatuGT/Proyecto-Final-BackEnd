const { check, validationResult } = require("express-validator");

exports.filmsValidationResult = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const error = result.array()[0].msg;
    return res.status(422).json({ succes: false, error: error });
  }
  next();
};

exports.filmsValidaciones = [
  check("nombre")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Este campo es requerido.")
    .isLength({ min: 1, max: 60 })
    .withMessage("Ingrese entre 1 y 60 caracters."),
  check("director")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Este campo es requerido.")
    .isLength({ min: 1 }),
  check("protagonistas")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Este campo es requerido.")
    .isLength({ min: 1 }),
  check("duracion")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Este campo es requerido.")
    .isLength({ min: 4 }),
  check("trailer")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Este campo es requerido."),
  check("imagenVertical")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Este campo es requerido."),
  check("imagenHorizontal")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Este campo es requerido."),
  check("fecha_de_Estreno")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Este campo es requerido."),
  check("sinopsis")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Este campo es requerido."),
  check("genero")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Este campo es requerido."),  
];
