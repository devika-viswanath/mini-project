import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Helper: Create and send cookie
const sendToken = (res, user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // ⚠️ true only in production
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // ✅ safe for prod & localhost
    maxAge: 7 * 24 * 60 * 60 * 1000,
    // ❌ remove domain unless you are 100% sure it matches
  });
};

// =======================
// Register: POST /api/user/register
// =======================
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, msg: "Missing details" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    sendToken(res, user); // ✅ Set the cookie

    return res.json({
      success: true,
      user: { email: user.email, name: user.name },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, msg: error.message });
  }
};

// =======================
// Login: POST /api/user/login
// =======================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({
        success: false,
        msg: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, msg: "Invalid credentials" });
    }

    sendToken(res, user); // ✅ Set the cookie

    return res.json({
      success: true,
      user: { email: user.email, name: user.name },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, msg: error.message });
  }
};

// =======================
// Auth Check: GET /api/user/is-auth
// =======================
export const isAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, msg: "User not found" });
    }
    return res.json({ success: true, user });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, msg: error.message });
  }
};

// =======================
// Logout: GET /api/user/logout
// =======================
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });
    return res.json({ success: true, msg: "Logged out" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, msg: error.message });
  }
};
