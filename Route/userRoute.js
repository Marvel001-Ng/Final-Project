const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUserRole,
  deleteUser,
} = require("../Controllers/userController");
const { auth, adminOnly } = require("../Middleware/Auth");

// All routes here are admin-only
router.get("/", auth, adminOnly, getUsers);
router.get("/:id", auth, adminOnly, getUserById);
router.put("/:id/role", auth, adminOnly, updateUserRole);
router.delete("/:id", auth, adminOnly, deleteUser);

module.exports = router;