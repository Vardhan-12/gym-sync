const { body } = require("express-validator");

exports.workoutValidator = [
  body("exercise")
    .notEmpty()
    .withMessage("Exercise is required"),

  body("sets")
    .isInt({ min: 1 })
    .withMessage("Sets must be a positive number"),

  body("reps")
    .isInt({ min: 1 })
    .withMessage("Reps must be a positive number"),

  body("weight")
    .isNumeric()
    .withMessage("Weight must be a number"),
];