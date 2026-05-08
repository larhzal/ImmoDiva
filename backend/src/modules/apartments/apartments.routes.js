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

const { protectDev } = require("../../middleware/auth.middleware");

// List all apartments
router.get("/", getAllAppartements);

// ✅ /my BEFORE /:id — otherwise "my" is treated as an id
router.get("/my", protectDev, getMyApartments);

router.get("/clients/my", protectDev, getMyClients);

// Delete an apartment (protect so only the owner can delete)
router.delete("/:id", protectDev, deleteAppartement);

// Get a single apartment (with photos)
router.get("/:id", getAppartement);

// Create a new apartment
router.post("/", upload.array("photos", 15), createAppartement);

// Update an existing apartment
router.put("/:id", upload.array("photos", 15), updateAppartement);

module.exports = router;