require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.json());

// Routes
const userRoutes = require("./src/modules/users/users.routes");
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});