require("dotenv").config();

const express = require("express");

const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const {supabase, supabaseAdmin} = require("./src/config/db");

// Routes
const userRoutes = require("./src/modules/users/users.routes.js");
const authRoutes = require("./src/modules/auth/auth.routes");
const feedbackRoutes = require("./src/modules/feedback/feedback.routes");
const rentalRoutes = require('./src/modules/rentals/rentals.routes.js');
const appartementRoutes = require("./src/modules/apartments/apartments.routes");

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/appartements", appartementRoutes);

// GET annonces avec filtres
app.get("/api/annonces", async (req, res) => {
    try {
        const { city, priceRange, rooms } = req.query;

        let query = supabase
            .from("Apartment")
            .select("*,Pictures(*)");

        // Filtre par ville
        if (city) {
            query = query.eq("city", city);
        }

        // Filtre par prix
        if (priceRange) {
            switch (priceRange) {
                case "below3000":
                    query = query.lt("monthly_price", 3000);
                    break;

                case "3000-6000":
                    query = query
                        .gte("monthly_price", 3000)
                        .lte("monthly_price", 6000);
                    break;

                case "above6000":
                    query = query.gt("monthly_price", 6000);
                    break;
            }
        }

        // Filtre par chambres
        if (rooms) {
            switch (rooms) {
                case "1":
                    query = query.eq("number_rooms", 1);
                    break;

                case "2":
                    query = query.eq("number_rooms", 2);
                    break;

                case "3plus":
                    query = query.gte("number_rooms", 3);
                    break;
            }
        }

        const { data, error } = await query;

        if (error) throw error;

        res.json(data);

    } catch (err) {
        console.error("Erreur backend:", err.message);

        res.status(500).json({
            error: err.message
        });
    }
});

// GET annonce par ID
app.get("/api/annonces/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("Apartment")
            .select("*,Pictures(*)")
            .eq("id", id)
            .single();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({
                error: "Appartement non trouvé"
            });
        }

        res.json(data);

    } catch (err) {
        console.error("Erreur backend:", err.message || err);

        res.status(500).json({
            error: err.message || "Une erreur est survenue."
        });
    }
});

// feedbackRoutes last, so the inline GET handlers above take priority
app.use("/api/annonces", feedbackRoutes);

const appartementRoutes = require("./src/modules/apartments/apartments.routes");
app.use("/api/appartements", appartementRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);});

app.use(cors());
app.use(express.json());

// IMPORT ROUTE
const pendingApartmentsRoutes = require("./src/modules/apartments/pendingApartments.routes");

// USE ROUTE
app.use("/apartments/pending", pendingApartmentsRoutes);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});