require("dotenv").config();
const express = require("express");
const database = require("./config/database");

const authRoutes = require("./routes/authRoutes");
const registrationRoutes = require("./routes/registrationRoutes");

const app = express();

database();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

app.use("/auth", authRoutes);
app.use("/", registrationRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

if (process.env.NODE_ENV !== "production") {
  const https = require("https");
  const fs = require("fs");
  const path = require("path");

  const options = {
    key: fs.readFileSync(path.join(__dirname, "cert", "server.key")),
    cert: fs.readFileSync(path.join(__dirname, "cert", "server.crt")),
  };

  https.createServer(options, app).listen(process.env.PORT || 3000, () => {
    console.log(`Server running at https://localhost:${process.env.PORT || 3000}`);
  });
}

module.exports = app;
