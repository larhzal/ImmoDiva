const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const { protect } = require("../../middleware/auth.middleware");

// Décommenter ces 4 lignes suivantement pour tester sans authentification et commenter les routess protégées à la fin du fichier
// const { protectDev } = require("../../middleware/auth.middleware"); // temp

// router.get("/me", protectDev, authController.getMe); // temp
// router.put("/update-profile", protectDev, authController.updateProfile);
// router.post("/reset-password", protectDev, authController.updatePassword);

// Cette route est protégée : seul un utilisateur avec un token valide y accède
router.get("/me", protect, authController.getMe);
router.put("/update-profile", protect, authController.updateProfile);
router.post("/reset-password", protect, authController.updatePassword);

module.exports = router;