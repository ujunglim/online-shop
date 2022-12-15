const express = require("express");
const csurf = require("csurf");
const session = require("express-session");

const path = require("path");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const baseRoutes = require("./routes/base");
const adminRoutes = require("./routes/admin");
const db = require("./data/database");
const addCsrfTokenMiddleware = require("./middleware/csrf-token");
const errorHandlerMiddleware = require("./middleware/error-handler");
const checkAuthStatusMiddleware = require("./middleware/check-auth");
const createSessionConfig = require("./config/session");
const app = express();

// activate EJS view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public")); // serve static files
app.use("/product/assets", express.static("product-data")); // filter
app.use(express.urlencoded({ extended: false }));

const sessionConfig = createSessionConfig();
app.use(session(sessionConfig));
app.use(csurf());

// ====== middleware ======
app.use(addCsrfTokenMiddleware); // make all request can check token
app.use(checkAuthStatusMiddleware);

// ====== routes ======
app.use(authRoutes);
app.use(productRoutes);
app.use(baseRoutes);
app.use("/admin", adminRoutes);

app.use(errorHandlerMiddleware);

db.connectToDatabase()
  .then(() => app.listen(3000))
  .catch((err) =>
    console.log(`Failed to connect to the databse with this error: ${err}`)
  );
