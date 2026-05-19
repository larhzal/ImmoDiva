require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const userRoutes              = require("./src/modules/users/users.routes.js");
const authRoutes              = require("./src/modules/auth/auth.routes");
const feedbackRoutes          = require("./src/modules/feedback/feedback.routes");
const rentalRoutes            = require('./src/modules/rentals/rentals.routes.js');
const appartementRoutes       = require("./src/modules/apartments/apartments.routes");
const pendingApartmentsRoutes = require("./src/modules/apartments/pendingApartments.routes");
const listingsRoutes          = require('./src/modules/listings/listings.routes');

app.use("/api/users",           userRoutes);
app.use("/api/auth",            authRoutes);
app.use("/api/rentals",         rentalRoutes);
app.use("/api/appartements",    appartementRoutes);
app.use("/apartments/pending",  pendingApartmentsRoutes);
app.use("/api/annonces",        listingsRoutes);   // GET /, GET /cities, GET /:id
app.use("/api/annonces",        feedbackRoutes);   // POST feedback

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});