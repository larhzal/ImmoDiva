const authService = require("./auth.service");

// REGISTER
exports.register = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message,
      details: error.details || null,
    });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message,
      details: error.details || null,
    });
  }
};
// ─────────────────────────
// FORGOT PASSWORD — Tâche 6
// POST /api/auth/forgot-password
// Body : { email }
// ─────────────────────────
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await authService.requestPasswordReset({ email });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message,
      details: error.details || null,
    });
  }
};
 
// ─────────────────────────────────────────────────────────────────────────────
// LOGOUT
// Le frontend envoie : Authorization: Bearer <access_token>
// On extrait le token depuis le header et on invalide la session
// ─────────────────────────────────────────────────────────────────────────────
exports.logout = async (req, res) => {
  try {
    // Extraire le token depuis le header Authorization: Bearer <token>
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;
 
    const result = await authService.logoutUser({ accessToken });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message,
      details: error.details || null,
    });
  }
};
 
// ─────────────────────────
// RESET PASSWORD — Tâche 7
// POST /api/auth/reset-password
// Body : { accessToken, newPassword }
// ─────────────────────────
exports.resetPassword = async (req, res) => {
  try {
    const { accessToken, newPassword } = req.body;
    const result = await authService.updatePassword({ accessToken, newPassword });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message,
      details: error.details || null,
    });
  }
};
 