const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../user/user.model");

const registerUser = async ({ username, email, password }) => {
  console.log('[auth.service] registerUser: start', { username, email });

  // Check if user exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash password
  console.log('[auth.service] registerUser: hashing password');
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    username,
    email,
    password: hashedPassword
  });

  console.log('[auth.service] registerUser: user created', { id: user._id });
  // Generate token
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    }
  };
};

const loginUser = async ({ email, password }) => {
  console.log('[auth.service] loginUser: start', { email });

  const user = await User.findOne({ email });

  if (!user) {
    console.log('[auth.service] loginUser: user not found');
    throw new Error("Invalid credentials");
  }

  console.log('[auth.service] loginUser: comparing password');
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    console.log('[auth.service] loginUser: invalid password');
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  console.log('[auth.service] loginUser: success', { id: user._id });

  return {
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    }
  };
};

module.exports = { registerUser, loginUser };