const supabase = require("../../config/db");

// Mapping des rôles
const roleMappings = {
  Client: "Client",
  Publisher: "Publisher",
};

// ─────────────────────────
// REGISTER
// ─────────────────────────
exports.registerUser = async (payload) => {
  const {
    firstName, lastName, username, email, password, role,
    phone, phone_number, first_name, last_name,
  } = payload;

  const normalizedFirstName = firstName || first_name;
  const normalizedLastName  = lastName  || last_name;
  const phoneValue          = phone || phone_number || null;

  if (!normalizedFirstName || !normalizedLastName || !username || !email || !password || !role) {
    const error = new Error("Tous les champs sont obligatoires.");
    error.status = 400;
    throw error;
  }

  const dbRole = roleMappings[role];

  if (!dbRole) {
    const error = new Error(`Rôle invalide : ${role}`);
    error.status = 400;
    throw error;
  }

  if (password.length < 6) {
    const error = new Error("Mot de passe trop court.");
    error.status = 400;
    throw error;
  }

  // Vérifier username
  const { data: existing } = await supabase
    .from("User")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  if (existing) {
    const error = new Error("Username déjà utilisé.");
    error.status = 409;
    throw error;
  }

  // Création Auth
  const { data: signUpData, error: signUpError } =
    await supabase.auth.admin.createUser({
      email: email.trim().toLowerCase(),
      password,
      email_confirm: true,
      user_metadata: { username, role: dbRole },
    });

  if (signUpError) {
    const error = new Error(signUpError.message);
    error.status = 400;
    throw error;
  }

  const user = signUpData.user;

  // Création profil
  const { error: profileError } = await supabase
    .from("User")
    .insert([
      {
        id: user.id,
        first_name: normalizedFirstName,
        last_name: normalizedLastName,
        username,
        role: dbRole,
        status: "unblocked",
        phone_number: phoneValue,
      },
    ]);

  if (profileError) {
    await supabase.auth.admin.deleteUser(user.id);
    const error = new Error(profileError.message);
    error.status = 500;
    throw error;
  }

  return {
    message: "Inscription réussie",
    user: {
      id: user.id,
      email: user.email,
      username,
      role: dbRole,
    },
  };
};

// ─────────────────────────
// LOGIN
// ─────────────────────────
exports.loginUser = async (payload) => {
  const { username, password } = payload;

  if (!username || !password) {
    const error = new Error("Identifiant et mot de passe requis.");
    error.status = 400;
    throw error;
  }

  // Chercher user
  const { data: userProfile, error: profileError } = await supabase
    .from("User")
    .select("id, username, role")
    .eq("username", username.trim())
    .maybeSingle();

  if (profileError) {
    const error = new Error("Erreur serveur.");
    error.status = 500;
    throw error;
  }

  if (!userProfile) {
    const error = new Error("Identifiant ou mot de passe incorrect.");
    error.status = 401;
    throw error;
  }

  // Récupérer email
  const { data: authData, error: authError } =
    await supabase.auth.admin.getUserById(userProfile.id);

  if (authError || !authData?.user?.email) {
    const error = new Error("Utilisateur introuvable.");
    error.status = 404;
    throw error;
  }

  const email = authData.user.email;

  // Login
  const { data: loginData, error: loginError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (loginError) {
    const error = new Error("Identifiant ou mot de passe incorrect.");
    error.status = 401;
    throw error;
  }

  return {
    message: "Connexion réussie",
    user: {
      id: userProfile.id,
      username: userProfile.username,
      email,
      role: userProfile.role,
    },
    session: loginData.session,
  };
};
// ─────────────────────────────────────────────────────────────────────────────
// LOGOUT — Tache deconnexion
// Le frontend envoie le access_token dans le header Authorization
// On invalide la session cote Supabase Auth
// ─────────────────────────────────────────────────────────────────────────────
exports.logoutUser = async ({ accessToken }) => {
  if (!accessToken) {
    const error = new Error("Token manquant.");
    error.status = 401;
    throw error;
  }
 
  // Verifier que le token est valide
  const { data: userData, error: userError } =
    await supabase.auth.getUser(accessToken);
 
  if (userError || !userData?.user) {
    const error = new Error("Session invalide ou deja expiree.");
    error.status = 401;
    throw error;
  }
 
  // Invalider TOUTES les sessions de cet utilisateur (global signout)
  const { error: signOutError } = await supabase.auth.admin.signOut(
    userData.user.id,
    "global"
  );
 
  if (signOutError) {
    const error = new Error("Impossible de deconnecter l'utilisateur.");
    error.details = signOutError.message;
    error.status  = 500;
    throw error;
  }
 
  return { message: "Deconnexion reussie." };
};
// ─────────────────────────────────────────────────────────────────────────────
// DEMANDE DE RÉINITIALISATION — Tâche 6
// Supabase envoie lui-même l'email avec un lien sécurisé vers /reset-password
// On répond toujours le même message (sécurité : ne pas révéler si l'email existe)
// ─────────────────────────────────────────────────────────────────────────────
exports.requestPasswordReset = async ({ email }) => {
  if (!email?.trim()) {
    const error = new Error("L'adresse email est requise.");
    error.status = 400;
    throw error;
  }
 
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    const error = new Error("Format d'email invalide.");
    error.status = 400;
    throw error;
  }
 
  // Supabase envoie l'email uniquement si le compte existe
  // redirectTo : page frontend qui récupère le token dans l'URL
  const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/+$/, '');

  const { error: resetError } = await supabase.auth.resetPasswordForEmail(
    email.trim().toLowerCase(),
    { redirectTo: `${frontendUrl}/reset-password` }
  );

  if (resetError) {
    const error = new Error("Impossible d'envoyer l'email de réinitialisation.");
    error.details = resetError.message;
    error.status  = 500;
    throw error;
  }
 
  // Toujours le même message pour ne pas révéler si l'email existe
  return {
    message: "Si cet email est associé à un compte, un lien de réinitialisation a été envoyé.",
  };
};
 
// ─────────────────────────────────────────────────────────────────────────────
// MISE À JOUR DU MOT DE PASSE — Tâche 7
// L'utilisateur clique sur le lien email → Supabase redirige vers
// /reset-password#access_token=xxx — le frontend extrait ce token et l'envoie ici
// ─────────────────────────────────────────────────────────────────────────────
exports.updatePassword = async ({ accessToken, newPassword }) => {
  if (!accessToken) {
    const error = new Error("Token de réinitialisation manquant.");
    error.status = 400;
    throw error;
  }
 
  if (!newPassword || newPassword.length < 6) {
    const error = new Error("Le mot de passe doit contenir au moins 6 caractères.");
    error.status = 400;
    throw error;
  }
 
  // Vérifier que le token est valide et obtenir l'utilisateur
  const { data: userData, error: userError } = await supabase.auth.getUser(accessToken);

  if (userError || !userData?.user?.id) {
    const error = new Error("Lien de réinitialisation invalide ou expiré.");
    error.status = 401;
    throw error;
  }

  // Mettre à jour le mot de passe via le token de récupération
  const { error: updateError } = await supabase.auth.updateUser(
    { password: newPassword },
    { accessToken }
  );

  if (updateError) {
    const error = new Error("Impossible de mettre à jour le mot de passe.");
    error.details = updateError.message;
    error.status  = 500;
    throw error;
  }
 
  return { message: "Mot de passe mis à jour avec succès." };
};
 