const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;

// For admin operations (password update, etc.)
const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY);

// For auth operations (signInWithPassword, etc.)
const supabaseAuth = createClient(supabaseUrl, process.env.SUPABASE_ANON_KEY);

module.exports = { supabaseAdmin, supabaseAuth };