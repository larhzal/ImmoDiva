const { supabaseAdmin, supabaseAuth } = require("../../config/db");

exports.getProfile = async (userId) => {
  const { data: profile, error } = await supabaseAdmin
    .from("User")
    .select("id, first_name, last_name, username, role, phone_number, status, nationality, age")
    .eq("id", userId)
    .single();

  if (error) throw { status: 500, message: "Erreur lors de la récupération du profil." };
  return profile;
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

  if (error) throw { status: 500, message: "Erreur lors de la mise à jour du profil." };
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