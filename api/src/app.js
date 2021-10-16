import path from "path";
require("dotenv").config({ path: path.join(__dirname, "../.env") });
import express from "express";
import logger from "morgan";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import "./configs/mongoose.config";
import routes from "./routes";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerDocumentJson from "../swagger.json";
import './helpers/seed'

const app = express();

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(logger("dev"));
app.use(
  express.json({
    limit: "20mb"
  })
);
app.use(
  express.urlencoded({
    extended: false,
    limit: "20mb"
  })
);

// set routers
app.use("/api", routes);
const specs = swaggerJsdoc(swaggerDocumentJson);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// handling error
app.use((err, req, res, next) => {
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 4444;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log("Server listening on " + PORT);
});
