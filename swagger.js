const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "啾啾 API",
    description: "啾啾 API",
  },
  host:
    process.env.NODE_ENV === "production"
      ? "chirp-space-backend.zeabur.app"
      : "localhost:3000",
  schemes: ["http", "https"],
  securityDefinitions: {
    Bearer: {
      type: "apiKey",
      in: "header",
      name: "authorization",
      description: "請加上 JWT Token",
    },
  },
  consumes: ["application/json"],
};

const outputFile = "./swagger-output.json";

const endpointsFiles = ["./app.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
