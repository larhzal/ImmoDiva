const { supabase } = require("../../config/db");

const getAllUsersFromDB = async () => {
    const { data, error } = await supabase
        .from("User")
        .select("id, first_name, last_name, role, status, created_at")
        .neq('role', 'Admin');
    return { data, error };
};

const blockUserById = async (id) => {
    const { error } = await supabase
        .from("User")
        .update({ status: 'blocked' })
        .eq('id', id);
    return { error };
};

const unblockUserById = async (id) => {
    const { error } = await supabase
        .from("User")
        .update({ status: 'unblocked' })
        .eq('id', id);
    return { error };
};

module.exports = { getAllUsersFromDB, blockUserById, unblockUserById };