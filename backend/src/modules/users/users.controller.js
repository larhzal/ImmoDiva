const { getAllUsersFromDB, blockUserById, unblockUserById } = require("./users.service");

const getAllUsers = async (req, res) => {
    try {
        const { data, error } = await getAllUsersFromDB();
        if (error) return res.status(500).json({ error: error.message });
        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const blockUser = async (req, res) => {
    try {
        const { error } = await blockUserById(req.params.id);
        if (error) return res.status(500).json({ error: error.message });
        res.json({ message: "Utilisateur bloqué ✅" });
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