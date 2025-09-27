import jwt from "jsonwebtoken";

const authSeller = async (req, res, next) => {
  const { sellerToken } = req.cookies;

  if (!sellerToken) {
    return res.json({ success: false, msg: "No token. Not authorized" });
  }

  try {
    const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);

    if (decoded.email === process.env.SELLER_EMAIL) {
      req.userId = decoded.id;
      next();
    } else {
      return res.json({ success: false, msg: "Invalid seller credentials" }); 
    }
  } catch (error) {
    return res.json({ success: false, msg: "Invalid or expired token" }); 
  }
};

export default authSeller;
