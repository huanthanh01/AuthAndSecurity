require("dotenv").config();
const express = require("express");
const path = require("path");
const database = require("./config/database");
const bookingRoutes = require("./routes/bookingRoutes");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
database();
app.use(express.urlencoded({ extended: true }));
app.use("/bookings", bookingRoutes);
app.get("/", (req, res) => {
  res.redirect("/bookings");
});

if (process.env.NODE_ENV !== "production") {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running at http://localhost:${process.env.PORT || 3000}`);
  });
}

module.exports = app;
