const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");

// Routes propres (sans async inutile)
router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;