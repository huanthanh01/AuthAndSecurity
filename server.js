require("dotenv").config();
const express = require("express");
const database = require("./config/database");

const authRoutes = require("./routes/authRoutes");
const registrationRoutes = require("./routes/registrationRoutes");

const app = express();

database();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/", registrationRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Event Management System API" });
});

if (process.env.NODE_ENV !== "production") {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running at http://localhost:${process.env.PORT || 3000}`);
  });
}

module.exports = app;
