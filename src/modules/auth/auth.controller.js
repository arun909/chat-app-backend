const { registerUser } = require("./auth.service");

const register = async (req, res) => {
  try {
    const userData = await registerUser(req.body);

    res.status(201).json({
      success: true,
      data: userData
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { register };
