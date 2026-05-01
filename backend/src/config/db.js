const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "[db.js] Variables manquantes : vérifiez SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans votre .env"
  );
}
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession:   false,
  },
});

module.exports = supabase;