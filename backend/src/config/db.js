const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY; // or service_role for backend only

const supabase = createClient(supabaseUrl, supabaseKey);

//pour tester dans le backend avec l'auth

// const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY // obligatoire pour admin

// const supabase = createClient(supabaseUrl, supabaseKey, {
//   auth: {
//     autoRefreshToken: false,
//     persistSession: false,
//   },
// });

module.exports = supabase;