const { searchUsersService } = require("./user.service");

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

module.exports = { searchUsers };
