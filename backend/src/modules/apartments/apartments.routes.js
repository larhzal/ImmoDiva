const express = require("express");
const router = express.Router();

const upload = require("multer")(); 
const { createAppartement } = require("../../controllers/apartment.controller");


router.post("/", upload.array("photos", 15), createAppartement);

module.exports = router;