const { body, query } = require("express-validator");

/*
  CREATE WORKOUT VALIDATION
*/
const createWorkoutValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Workout title is required"),

  body("duration")
    .notEmpty()
    .withMessage("Duration is required")
    .isInt({ min: 1 })
    .withMessage("Duration must be a positive number"),

  body("calories")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Calories must be a positive number"),

  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO date (YYYY-MM-DD)")
];


/*
  PAGINATION + FILTER VALIDATION
*/
const paginationValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be greater than or equal to 1"),

  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit must be greater than or equal to 1"),

  query("start")
    .optional()
    .isISO8601()
    .withMessage("Start date must be valid (YYYY-MM-DD)"),

  query("end")
    .optional()
    .isISO8601()
    .withMessage("End date must be valid (YYYY-MM-DD)")
];

module.exports = {
  createWorkoutValidator,
  paginationValidator
};