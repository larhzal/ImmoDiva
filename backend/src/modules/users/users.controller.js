const supabase = require("../../config/db");
   
   //getallusers
   const getAllUsers = async (req, res) => {
    try {
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
    } catch (err) {
        console.error("Erreur backend:", err.message);  

        res.status(500).json({
            error: err.message
        });
    }
};

module.exports = {
    getAllUsers
};