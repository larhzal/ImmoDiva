const { supabase } = require("../../config/db");


const getAllUsersFromDB = async (page = 1, limit = 10) => {
   
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
        .from("User")
        .select("id, first_name, last_name, role, status, created_at", { count: 'exact' })
        .neq('role', 'Admin')
        .order('created_at', { ascending: false })
        .range(from, to); 

    return { data, error, count };
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