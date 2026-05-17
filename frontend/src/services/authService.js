const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Enregistrement d'un nouvel utilisateur
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de l\'enregistrement');
    }

    const data = await response.json();
    return data; // Retourne { token, user, message } ou similaire
  } catch (error) {
    throw error;
  }
};

// Connexion d'un utilisateur
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la connexion');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

// Déconnexion
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('selectedRole');
  sessionStorage.removeItem('registrationData');
};

// Vérifier si l'utilisateur est connecté
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Récupérer les données utilisateur stockées
export const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};
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
