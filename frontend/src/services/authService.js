// ─────────────────────────
// GET CURRENT USER PROFILE
// ─────────────────────────
exports.getUserProfile = async (userId) => {
  if (!userId) {
    const error = new Error("ID utilisateur manquant.");
    error.status = 400;
    throw error;
  }

  // Récupérer les données depuis la table "User" (casing exact de ta base)
  const { data: profile, error: profileError } = await supabase
    .from("User") // Utilise "User" avec la majuscule comme dans tes erreurs SQL précédentes
    .select("id, first_name, last_name, username, role, phone_number, status, nationality, age")
    .eq("id", userId)
    .maybeSingle();

  if (profileError) {
    const error = new Error("Erreur lors de la récupération du profil.");
    error.status = 500;
    throw error;
  }

  if (!profile) {
    const error = new Error("Profil introuvable.");
    error.status = 404;
    throw error;
  }

  // Récupérer l'email via l'admin API de Supabase (car l'email est dans 'auth.users' et non 'public.User')
  const { data: authData, error: authError } = await supabase.auth.admin.getUserById(userId);

  return {
    ...profile,
    email: authData?.user?.email || null, // On rajoute l'email pour ton formulaire ProfileForm[cite: 8, 9]
  };
};