const User = require("../models/user");


// @access  Private (Admin only)
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      msg: "Users fetched successfully",
      count: users.length,
      users,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "server error" });
  }
};


// @access  Private (Admin only)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({ msg: "User fetched successfully", user });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "server error" });
  }
};


const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ msg: "role must be 'user' or 'admin'" });
    }

    
    if (req.params.id === req.user._id.toString() && role !== "admin") {
      return res.status(400).json({ msg: "You cannot remove your own admin access" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({ msg: "User role updated successfully", user });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "server error" });
  }
};


// @access  Private (Admin only)
const deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ msg: "You cannot delete your own account here" });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({ msg: "User deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "server error" });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUserRole,
  deleteUser,
};