import express from "express";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
// import xss from "xss-clean";
import MongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import config from "./config";

import GlobalErrorHandler from "./controllers/errorController";
import NotFoundError from "./Errors/notFoundError";
import AppError from "./Errors/appError";

import routers from "./routers/router";
import BadRequestError from "./Errors/badRequestError";

// GLOBAL MIDDLEWARES
const app = express();
if (config.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.set("trust proxy", 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many request from this IP, please try again later",
});

app.use(limiter); // Rate limit for IP Address
app.use(cors()); // Enable cross origin resource sharing (CORS) support
app.use(hpp()); // Prevent parameter pollution(duplicate query strings)
// app.use(xss()); //Data sanitisation against xss
app.use(helmet()); // Setting security provisional headers
app.use(MongoSanitize());

// Parse Json data with incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", routers);

app.all("*", () => {
  throw new BadRequestError("Route not found");
});

app.use(GlobalErrorHandler);

export default app;
