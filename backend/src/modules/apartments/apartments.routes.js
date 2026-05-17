const express = require("express");
const router = express.Router();
const upload = require("multer")();

const {
    createAppartement,
    getAppartement,
    getAllAppartements,
    updateAppartement,
    getMyApartments,
    getMyClients,
    deleteAppartement,
} = require("./apartments.controller");

const authMiddleware = require("../../middleware/auth.middleware");

// List all apartments
router.get("/", getAllAppartements);

// ✅ /my BEFORE /:id — otherwise "my" is treated as an id
router.get("/my", authMiddleware, getMyApartments);

router.get("/clients/my", authMiddleware, getMyClients);

// Delete an apartment (protect so only the owner can delete)
router.delete("/:id", authMiddleware, deleteAppartement);

// Get a single apartment (with photos)
router.get("/:id", getAppartement);

// Create a new apartment
router.post("/", upload.array("photos", 15), createAppartement);

// Update an existing apartment
router.put("/:id", upload.array("photos", 15), updateAppartement);

module.exports = router;