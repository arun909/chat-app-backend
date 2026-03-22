const {
  searchUsersService,
  updateProfileService,
  changePasswordService,
  deleteProfilePicService
} = require("./user.service");

const searchUsers = async (req, res) => {
  try {
    const users = await searchUsersService(req.query.query, req.user._id);

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const getProfile = async (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
};

const updateProfile = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // If a file was uploaded, add the path to updateData
    if (req.file) {
      updateData.profilePic = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await updateProfileService(req.user._id, updateData);
    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await changePasswordService(req.user._id, currentPassword, newPassword);

    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const deleteProfilePic = async (req, res) => {
  try {
    const updatedUser = await deleteProfilePicService(req.user._id);

    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { searchUsers, getProfile, updateProfile, changePassword, deleteProfilePic };
