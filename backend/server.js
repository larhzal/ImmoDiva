require("dotenv").config();
process.on("uncaughtException", (err) => {
    console.error("🔥 UNCUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (err) => {
    console.error("🔥 UNHANDLED REJECTION:", err);
});
const express = require("express");

const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const userRoutes = require("./src/modules/users/users.routes");
app.use("/api/users", userRoutes);

const appartementRoutes = require("./src/modules/apartments/apartments.routes");
app.use("/api/appartements", appartementRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});