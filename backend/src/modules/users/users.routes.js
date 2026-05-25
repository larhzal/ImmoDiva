const express = require("express");
const router = express.Router();
const { getAllUsers, blockUser, unblockUser } = require("./users.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const roleMiddleware = require("../../middleware/role.middleware");

router.get("/", authMiddleware, roleMiddleware('Admin'), getAllUsers);
router.put("/:id/block", authMiddleware, roleMiddleware('Admin'), blockUser);
router.put("/:id/unblock", authMiddleware, roleMiddleware('Admin'), unblockUser);

module.exports = router;