// External imports
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { readdirSync } = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

//Security Middleware Import
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const morgan = require("morgan");

// express app initialization
const app = express();
app.use(express.json());
// Use body-parser middleware to parse JSON requests
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Security middleware initialization
app.use(
  cors({
    origin: "*", // Allow requests from any origin (Need to change it at production mode)
    credentials: true,
  })
);

app.use(helmet());
app.use(mongoSanitize());
app.use(hpp());
app.use(morgan("dev"));

//Request Rate Limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 10000, // limit each IP to 10000 requests per windowMs (change before the production)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);

// Routing middleware initialization
const routesPath = path.join(__dirname, "src", "routes");
try {
  readdirSync(routesPath).map((file) => {
    const routePath = path.join(routesPath, file);
    if (path.extname(routePath) === ".js") {
      app.use("/api/v1", require(routePath));
    }
  });
} catch (error) {
  console.error("Error loading routes:", error);
}

// Swagger options
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Giga Diet Apis",
      version: "1.0.0",
      description: "API documentation for Giga Diet",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 8000}/api/v1`, // Development server
        description: "Development server",
      },
      {
        url: "https://example.com/api/v1", // Change this to your production URL
        description: "Production server",
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Path to your API routes
};

const swaggerSpec = swaggerJSDoc(options);

app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// module exports
module.exports = app;
