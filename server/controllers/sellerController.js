import jwt from "jsonwebtoken";

// ================
// Shared Helper
// ================
const sendSellerToken = (res, email) => {
  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("sellerToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// ================
// Seller Login: POST /api/seller/login
// ================
export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.SELLER_EMAIL &&
      password === process.env.SELLER_PASSWORD
    ) {
      sendSellerToken(res, email);
      return res.json({ success: true, msg: "Logged In" });
    } else {
      return res.status(401).json({ success: false, msg: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, msg: error.message });
  }
};

// ================
// Seller Auth Check: GET /api/seller/is-auth
// ================
export const isSellerAuth = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, msg: error.message });
  }
};

// ================
// Seller Logout: GET /api/seller/logout
// ================
export const SellerLogout = async (req, res) => {
  try {
    res.clearCookie("sellerToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    return res.json({ success: true, msg: "Logged out" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, msg: error.message });
  }
};
