require("dotenv").config();
const express = require("express");
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
const supabase = require('./src/config/db');
// Routes
const userRoutes = require("./src/modules/users/users.routes");
app.use("/api/users", userRoutes);

app.get('/api/annonces', async (req, res) => {
    try {

        const { data, error } = await supabase
            .from('Apartment')
            .select('*');

        if (error) throw error;
        
        res.json(data);
    } catch (err) {
        console.error("Erreur backend:", err.message);
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});