const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY; // or service_role for backend only

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;