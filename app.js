const express = require("express");
const csurf = require("csurf");
const session = require("express-session");

const path = require("path");
const authRoutes = require("./routes/auth");
const db = require("./data/database");
const addCsrfTokenMiddleware = require("./middleware/csrf-token");
const errorHandlerMiddleware = require("./middleware/error-handler");
const createSessionConfig = require("./config/session");
const app = express();

// activate EJS view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public")); // serve static files
app.use(express.urlencoded({ extended: false }));

const sessionConfig = createSessionConfig();
app.use(session(sessionConfig));
app.use(csurf());
app.use(addCsrfTokenMiddleware); // make all request can check token

app.use(authRoutes);

app.use(errorHandlerMiddleware);

db.connectToDatabase()
  .then(() => app.listen(3000))
  .catch((err) =>
    console.log(`Failed to connect to the databse with this error: ${err}`)
  );