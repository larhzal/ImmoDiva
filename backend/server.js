require('dotenv').config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// routes
const userRoutes = require("./src/modules/users/users.routes.js");
const rentalRoutes = require('./src/modules/rentals/rentals.routes.js');

app.use("/api/users", userRoutes);
app.use("/api/rentals", rentalRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});