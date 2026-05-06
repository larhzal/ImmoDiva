const express = require("express");
const router = express.Router();
const { createClient } = require("@supabase/supabase-js");

// Supabase (use SERVICE ROLE here 🔥)
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// GET pending annonces
router.get("/", async (req, res) => {
    const { data, error } = await supabase
        .from("Apartment")
        .select("*")
        .eq("status", "En Attente")
        .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error });

    res.json(data);
});

// VALIDATE
router.put("/:id/validate", async (req, res) => {
    const { id } = req.params;

    const { error } = await supabase
        .from("Apartment")
        .update({ status: "Acceptée" })
        .eq("id", id);

    if (error) return res.status(500).json({ error });

    res.json({ message: "validé" });
});

// REJECT
router.put("/:id/reject", async (req, res) => {
    const { id } = req.params;

    const { error } = await supabase
        .from("Apartment")
        .update({ status: "Rejetée" })
        .eq("id", id);

    if (error) return res.status(500).json({ error });

    res.json({ message: "rejeté" });
});

// GET /apartments/stats
router.get("/stats", async (req, res) => {
    try {
        const { count: total } = await supabase
            .from("Apartment")
            .select("*", { count: "exact", head: true });

        const { count: approuvees } = await supabase
            .from("Apartment")
            .select("*", { count: "exact", head: true })
            .eq("status", "Acceptée");

        const { count: enAttente } = await supabase
            .from("Apartment")
            .select("*", { count: "exact", head: true })
            .eq("status", "En Attente");

        res.json({
            total: total || 0,
            approuvees: approuvees || 0,
            enAttente: enAttente || 0,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    const { error } = await supabase
        .from("Apartment")
        .delete()
        .eq("id", id);

    if (error) return res.status(500).json({ error });

    res.json({ message: "Appartement supprimé" });
});

module.exports = router;