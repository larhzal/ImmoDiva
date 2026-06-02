const { getAllUsersFromDB, blockUserById, unblockUserById } = require("./users.service");


const getAllUsers = async (req, res) => {
    try {
        
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 6;
        console.log(`[Backend] Demande reçue pour Page: ${page}, Limite: ${limit}`);

        const { data, error, count } = await getAllUsersFromDB(page, limit);
        
        if (error) {
            console.error(" Supabase:", error.message);
            return res.status(500).json({ error: error.message });
        }
        
        // On renvoie la réponse
        return res.json({ data, count });
        
    } catch (err) {
        console.error("[Backend Error] Catch:", err.message);
        return res.status(500).json({ error: err.message });
    }
};

const blockUser = async (req, res) => {
    try {
        const { error } = await blockUserById(req.params.id);
        if (error) return res.status(500).json({ error: error.message });
        res.json({ message: "Utilisateur bloqué " });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const unblockUser = async (req, res) => {
    try {
        const { error } = await unblockUserById(req.params.id);
        if (error) return res.status(500).json({ error: error.message });
        res.json({ message: "Utilisateur débloqué ✅" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAllUsers, blockUser, unblockUser };