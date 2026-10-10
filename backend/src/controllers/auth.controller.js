import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import asyncHandler from "../utils/asyncHandler.js";

// Only send safe fields back (never the password)
const userResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  age: user.age,
  gender: user.gender,
  bloodGroup: user.bloodGroup,
  role: user.role,
});

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, age, gender, bloodGroup } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email and password are required");
  }

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    res.status(409);
    throw new Error("Email is already registered");
  }

  // role is NOT taken from the request, so nobody can register as admin
  const user = await User.create({
    name,
    email,
    password,
    phone,
    age,
    gender,
    bloodGroup,
  });

  res.status(201).json({
    success: true,
    token: generateToken(user._id),
    user: userResponse(user),
  });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  // password is hidden by default, so we ask for it explicitly
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json({
    success: true,
    token: generateToken(user._id),
    user: userResponse(user),
  });
});

// GET /api/auth/me   (req.user is set by the protect middleware)
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

export { register, login, getMe };
