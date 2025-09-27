import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ success: false, msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user    = { id: decoded.id };
    req.userId  = decoded.id;
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, msg: "Invalid token" });
  }
};


export default authUser;
