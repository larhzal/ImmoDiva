const authService = require("./auth.service");

exports.getMe = async (req, res) => {
  try {
    const userProfile = await authService.getProfile(req.user.id);
    res.status(200).json({ user: userProfile });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updated = await authService.updateProfile(req.user.id, req.body);
    res.status(200).json({ message: "Profil mis à jour avec succès", user: updated });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    await authService.updatePassword(req.user.id, req.body.currentPassword, req.body.password);
    res.status(200).json({ message: "Mot de passe mis à jour avec succès" });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};