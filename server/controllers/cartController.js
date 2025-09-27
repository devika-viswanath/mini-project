// Update user cartData: /api/cart/update

import User from "../models/User.js";

export const updateCart = async (req, res) => {
  try {
    const { userId, cartItems } = req.body;
    await User.findByIdAndUpdate(userId, { cartItems });
    res.json({ success: true, msg: "Cart Updated" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, msg: error.message });
  }
};
 
  