const express = require("express");
const router = express.Router();
const supabase = require("../../config/db");

// GET users
router.get("/users", async (req, res) => {
    const { data, error } = await supabase
        .from("User")
        .select("*")
        .limit(5);

    if (error) {
        return res.status(500).json({
            message: "Query failed ❌",
            error: error.message
        });
    }

    res.json({
        message: "Users fetched successfully ✅",
        data
    });
});

module.exports = router;