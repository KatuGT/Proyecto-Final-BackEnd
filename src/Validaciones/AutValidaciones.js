const { check, validationResult } = require("express-validator");
const Usuario = require("../models/Usuario")

exports.userValidationResult = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const error = result.array()[0].msg;
    return res.status(422).json({ succes: false, error: error });
  }
  next();
};

exports.autValidaciones = [
  check("username")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Debes escribir tu apodo.")
    .isLength({ min: 6, max: 20 })
    .withMessage("Tu apodo debe tener entre 6 y 20 caracteres.")
    .custom((value, {req}) => {
        return new Promise((resolve, reject) => {
            Usuario.findOne({username:req.body.username}, function(err, user){
            if(err) {
              reject(new Error('Server Error'))
            }
            if(Boolean(user)) {
              reject(new Error('Este apodo ya esta en uso.'))
            }
            resolve(true)
          });
        });
      }),
  check("email")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Ingresa tu E-mail.")
    .isEmail()
    .withMessage("Ingresa un E-mail valido.")
    .custom((value, {req}) => {
        return new Promise((resolve, reject) => {
            Usuario.findOne({email:req.body.email}, function(err, user){
            if(err) {
              reject(new Error('Server Error'))
            }
            if(Boolean(user)) {
              reject(new Error('Este e-mail ya esta en uso.'))
            }
            resolve(true)
          });
        });
      }),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Ingresa una contraseña.")
    .isLength({ min: 8 }),
];
