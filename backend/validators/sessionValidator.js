const { body, validationResult, query, param } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

exports.createSessionValidator = [
  body("startTime")
    .notEmpty()
    .withMessage("Start time is required")
    .isISO8601()
    .withMessage("Invalid date format"),

  body("duration")
    .notEmpty()
    .withMessage("Duration is required")
    .isInt({ min: 1, max: 180 })
    .withMessage("Duration must be between 1 and 180 minutes"),

  validate,
];

exports.densityValidator = [
  query("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Invalid date format"),

  validate,
];

exports.overlapValidator = [
  param("sessionId")
    .isMongoId()
    .withMessage("Invalid session ID"),

  validate,
];