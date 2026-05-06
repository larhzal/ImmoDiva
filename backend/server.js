const cors = require("cors");

const express = require("express");
require("dotenv").config();

const app = express();
app.use(express.json());

app.use(cors());
app.use(express.json());

// IMPORT ROUTE
const pendingApartmentsRoutes = require("./src/modules/apartments/pendingApartments.routes");

// USE ROUTE
app.use("/apartments/pending", pendingApartmentsRoutes);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});