import app from "./app.js";
import http from "http";
import dotenv from "dotenv";

/* Config Path for Environments Variables */
dotenv.config({ path: ".env" });

const normalizePort = (val) => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

/* Setting the port for the app. */
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === "string" ? "pipe" + address : "port:" + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

/* Creating a server */
const server = http.createServer(app);

server.on("error", errorHandler);
server.on("listening", () => {
  console.log(
    "[server] Connected and listening to: " + process.env.URL + ":" + port
  );
});

server.listen(port);
