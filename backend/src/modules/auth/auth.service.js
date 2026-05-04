const { supabaseAdmin, supabaseAuth } = require("../../config/db");

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
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    // console.log("Admin check - first user:", data?.users?.[0]?.email, "error:", error);
    const { data: authUser, error: emailError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      email: data.email,
    });
    console.log("Email update - authUser:", authUser, "error:", emailError);
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
  const { data: signInData, error: signInError } = await supabaseAuth.auth.signInWithPassword({
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
};