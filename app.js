import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import * as fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/* Import Routes */
import { authRoutes } from "./routes/authRoutes.js";
import { saucesRoutes } from "./routes/saucesRoutes.js";

/* Import MongoDB connection */
import { ConnectDB } from "./config/database.js";

/* fix filename and dirname for type module nodejs */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* Config path for Environments Variables */
dotenv.config({ path: ".env" });

/* Create a new instance of express */
const app = express();

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

/* Middlewares */
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Allows the server to accept requests from any origin. ( CORS ) */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

/* Checks if the Images folder exists, if not creates this folder .*/
fs.access("images", function (error) {
  if (error) {
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
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/auth", authRoutes);
app.use("/api/sauces", saucesRoutes);

export default app;
