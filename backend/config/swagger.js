const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "GymSync API",
      version: "1.0.0",
      description: "Gym session analytics API"
    }
  },
  apis: ["./routes/*.js"]
};

const specs = swaggerJsdoc(options);

module.exports = specs;