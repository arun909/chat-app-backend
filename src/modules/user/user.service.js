const User = require("./user.model");

const searchUsersService = async (query, currentUserId) => {
  if (!query) {
    throw new Error("Search query is required");
  }

  const users = await User.find({
    username: { $regex: query, $options: "i" }, // case-insensitive
    _id: { $ne: currentUserId } // exclude logged-in user
  }).select("_id username email profilePic");

  return users;
};

module.exports = { searchUsersService };
