const { check, validationResult } = require("express-validator");

exports.loginValidaciones = [
  check("email")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Ingresa tu E-mail.")
    .isEmail()
    .withMessage("Ingresa un E-mail valido."),

  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Ingresa una contraseña.")
    .isLength({ min: 8 })
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    .withMessage("La contrasña no cumple con los requisitos."),
];
