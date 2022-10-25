import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import * as fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ConnectDB } from "./config/database.js";
import mongoSanitize from "express-mongo-sanitize";
import { authRoutes } from "./routes/authRoutes.js";
import { saucesRoutes } from "./routes/saucesRoutes.js";
import {limiter} from "./middlewares/rateLimit.js";

/* fix filename and dirname for type module nodejs */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* Config path for Environments Variables */
dotenv.config({ path: ".env" });

/* Create a new instance of express */
const app = express();

/* Set security HTTP headers */
app.use(helmet());

/* Parse json request body */
app.use(express.json());

/* Parse urlEncoded request body */
app.use(express.urlencoded({ extended: true }));

/* Sanitize request data */
app.use(mongoSanitize())

/* Applying the limiter on only the route that starts with /api */
app.use('/api', limiter);

/* Allows the server to accept requests from any origin. ( CORS ) */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  next();
});

/* Connection to Database */
ConnectDB(
  process.env.USER_DB,
  process.env.PASS_DB,
  process.env.SERVER_DB,
  process.env.NAME_DB
)
  .then(() =>
    console.log("[mongoDb] Connected to database : " + process.env.NAME_DB)
  )
  .catch((err) => {
    console.log(
      "[mongoDb] Failed to connect !!! --> " +
      [err.message] +
      " code:" +
      err.code
    );
    process.exit(1);
  });

/* Checks if the Images folder exists, if not creates this folder .*/
fs.access("images", function (notAccess) {
  if (notAccess) {
    fs.mkdir(path.join(__dirname, "images"), (err) => {
      if (err) {
        return console.log(err);
      }
      console.log("[Directory] Images folder created successfully !!!");
    });
    console.log("[Directory] Images folder doesn't exist.");
  } else {
    console.log("[Directory] Images folder already exist.");
  }
});

/* Routes */
app.use("/api/auth", authRoutes);
app.use("/api/sauces", saucesRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

export default app;
