const fs         = require('fs');
const path       = require('path');
const crypto     = require('crypto');
const nodemailer = require('nodemailer');
const {supabaseAdmin, supabase}   = require("../../config/db");

const logoPath   = path.join(__dirname, '../../../../frontend/src/assets/images/Logo.png');
const logoBase64 = fs.readFileSync(logoPath).toString('base64');
const logoSrc    = `data:image/png;base64,${logoBase64}`;


exports.getProfile = async (userId) => {

  // Step 1: Get profile from User table
  const { data: profile, error } = await supabase
    .from("User")
    .select(`id,first_name,last_name,username,role,phone_number,status,nationality,age`)
    .eq("id", userId)
    .single();

  if (error || !profile) {
    throw {
      status: 500,
      message: "Erreur lors de la récupération du profil."
    };
  }

  // Step 2: Get email from auth.users
  const {
    data,
    error: authError
  } = await supabase.auth.admin.getUserById(userId);

  if (authError || !data?.user) {
    throw {
      status: 500,
      message: "Erreur lors de la récupération de l'email."
    };
  }

  return {
    ...profile,
    email: data.user.email,
  };
};

// Mapping des rôles
const roleMappings = {
  Client: "Client",
  Publisher: "Publisher",
  Admin: "Admin",
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
    .select("id, username, role, status") // ✅ ajoute status
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

  // Vérifier si bloqué
  if (userProfile.status === 'blocked') {
    const error = new Error("Votre compte a été bloqué. Contactez l'administrateur.");
    error.status = 403;
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

// ─── Nodemailer transporter ───────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: 'smtp.resend.com',
  port: 465,
  secure: true,
  auth: {
    user: 'resend',
    pass: process.env.RESEND_API_KEY,
  },
});


// ─────────────────────────────────────────────────────────────────────────────
// DEMANDE DE RÉINITIALISATION — Tâche 6
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

  const normalizedEmail = email.trim().toLowerCase();

  // FIX: Instead of listUsers(), we search for the specific email using a metadata or custom profile table
  // (Alternatively, use a loop with pagination on listUsers, but this database approach is highly recommended for scalability)
  // AFTER — query Supabase Auth instead
  const { data: { users }, error: searchError } = await supabaseAdmin.auth.admin.listUsers();
  const authUser = !searchError && users?.find(u => u.email === normalizedEmail);
  const userExists = !!authUser;

  if (userExists) {
    // Générer un token aléatoire sécurisé (32 octets = 64 hex chars)
    const token     = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // +1 heure

    // Supprimer les anciens tokens pour cet email (éviter doublons)
    await supabase
      .from('password_resets')
      .delete()
      .eq('email', normalizedEmail);

    // Insérer le nouveau token
    const { error: insertError } = await supabase
      .from('password_resets')
      .insert([{ email: normalizedEmail, token, expires_at: expiresAt }]);

    if (insertError) {
      const error = new Error("Erreur lors de la création du token.");
      error.status = 500;
      throw error;
    }

    // Construire le lien de réinitialisation
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    console.log("Reset link generated:", resetLink);

    // FIX: Define logo URL so it doesn't throw a ReferenceError
    const logoSrc = process.env.LOGO_URL || "https://placehold.co/200x64?text=ImmoDIVA";
    try{
      console.log("Attempting to send reset email ...");
      // Envoyer l'email
      await transporter.sendMail({
        from: '"ImmoDIVA" <onboarding@resend.dev>',
        to:      normalizedEmail,
        subject: 'Réinitialisation de votre mot de passe',
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:auto">
            <img src="${logoSrc}" alt="ImmoDIVA" style="margin-bottom:40px;display:block;height:64px;width:auto;margin-left: 80px;margin-top: 120px;" />
            <h2 style="margin-left:50px;">Réinitialisation de mot de passe</h2>
            <p>Vous avez demandé à réinitialiser votre mot de passe ImmoDIVA.</p>
            <p>Cliquez sur le bouton ci-dessous. Ce lien est valable <strong>1 heure</strong>.</p>
            <a href="${resetLink}"
              style="display:inline-block;margin:16px 0;padding:12px 24px;
                      background:#f97316;color:#fff;border-radius:24px;
                      text-decoration:none;font-weight:600;margin-left:80px;">
              Réinitialiser mon mot de passe
            </a>
            <p style="color:#888;font-size:12px;margin-left:70px;">
              Si vous n'avez pas fait cette demande, ignorez cet email.
            </p>
          </div>
        `,
      });
      console.log("Reset email sent successfully");
    } catch (mailError) {
      console.error("❌ Failed to send reset email:", mailError);
      const error = new Error("Échec de l'envoi de l'email.");
      error.status = 500;
      throw error;
    }
  }

  // Toujours le même message (sécurité)
  return {
    message: "Si cet email est associé à un compte, un lien de réinitialisation a été envoyé.",
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// MISE À JOUR DU MOT DE PASSE — Tâche 7
// 1. Vérifie le token dans password_resets (existence + expiry)
// 2. Met à jour le mot de passe via Supabase admin
// 3. Supprime le token utilisé
// ─────────────────────────────────────────────────────────────────────────────
exports.resetPasswordByToken = async ({ accessToken, newPassword }) => {
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

  // Step 1: Fetch reset record by token
  const { data: resetRecord, error: fetchError } = await supabase
    .from('password_resets')
    .select('*')
    .eq('token', accessToken)
    .maybeSingle();

  if (fetchError || !resetRecord) {
    const error = new Error("Lien de réinitialisation invalide ou expiré.");
    error.status = 401;
    throw error;
  }

  // Step 2: Check expiry
  if (new Date() > new Date(resetRecord.expires_at)) {
    await supabase.from('password_resets').delete().eq('token', accessToken);
    const error = new Error("Lien expiré. Veuillez refaire une demande.");
    error.status = 401;
    throw error;
  }

  // Step 3: Find user by email via listUsers
  const { data: { users }, error: lookupError } =
    await supabaseAdmin.auth.admin.listUsers();

  if (lookupError) {
    const error = new Error("Erreur serveur lors de la recherche de l'utilisateur.");
    error.status = 500;
    throw error;
  }

  const foundUser = users.find(u => u.email === resetRecord.email);

  if (!foundUser?.id) {
    const error = new Error("Utilisateur introuvable.");
    error.status = 404;
    throw error;
  }

  // Step 4: Update password using the real UUID
  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
    foundUser.id,
    { password: newPassword }
  );

  if (updateError) {
    const error = new Error("Impossible de mettre à jour le mot de passe.");
    error.status = 500;
    throw error;
  }

  // Step 5: Delete used token
  await supabase.from('password_resets').delete().eq('token', accessToken);

  return { message: "Mot de passe mis à jour avec succès." };
};
exports.getProfile = async (userId) => {
  // Step 1: Get profile from User table
  const { data: profile, error } = await supabaseAdmin
    .from("User")
    .select("id, first_name, last_name, username, role, phone_number, status, nationality, age")
    .eq("id", userId)
    .single();

  if (error) throw { status: 500, message: "Erreur lors de la récupération du profil." };

  // Step 2: Get email from Supabase Auth
  const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId);
  if (authError) throw { status: 500, message: "Erreur lors de la récupération de l'email." };

  return {
    ...profile,
    email: authUser.user.email,
  };
};

exports.updateProfile = async (userId, data) => {
  const { data: updated, error } = await supabaseAdmin
    .from("User")
    .update({
      first_name: data.prenom,
      last_name: data.nom,
      phone_number: data.tel,
      nationality: data.nationalite,
      age: data.age,
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      if (error.details.includes("phone_number")) {
        throw { status: 409, message: "Ce numéro de téléphone est déjà utilisé par un autre compte." };
      }
      if (error.details.includes("email")) {
        throw { status: 409, message: "Cette adresse email est déjà utilisée par un autre compte." };
      }
      throw { status: 409, message: "Cette valeur est déjà utilisée par un autre compte." };
    }
    throw { status: 500, message: "Erreur lors de la mise à jour du profil." };
  }

  if (data.email) {
    // Rename to avoid shadowing the `data` parameter
    const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    const { error: emailError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      email: data.email,  // ← now correctly refers to the outer `data` (profile fields)
    });
    if (emailError) throw { status: 500, message: "Erreur lors de la mise à jour de l'email." };
  }

  return updated;
};

exports.updatePassword = async (userId, currentPassword, newPassword) => {
  // Step 1: Get user's email
  const { data: user, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
  console.log("Step 1 - user:", user?.user?.email, "error:", userError);
  if (userError) throw { status: 500, message: "Utilisateur introuvable." };

  // Step 2: Verify current password
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: user.user.email,
    password: currentPassword,
  });
  console.log("Step 2 - signInData:", signInData, "error:", signInError);
  if (signInError) throw { status: 401, message: "Mot de passe actuel incorrect." };

  // Step 3: Update password
  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    password: newPassword,
  });
  console.log("Step 3 - updateError:", updateError);
  if (updateError) throw { status: 500, message: "Erreur lors de la mise à jour du mot de passe." };
}