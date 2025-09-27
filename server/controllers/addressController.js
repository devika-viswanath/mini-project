import mongoose from "mongoose";
import Address from "../models/Address.js";

// POST /api/address/add
export const addAddress = async (req, res) => {
  try {
    const { address } = req.body;

    // Validation: check if userId exists and is valid
    if (!address.userId || !mongoose.Types.ObjectId.isValid(address.userId)) {
      return res.status(400).json({ success: false, msg: "Invalid or missing userId" });
    }

    // Convert userId string to ObjectId
    const addressToSave = {
      ...address,
      userId: new mongoose.Types.ObjectId(address.userId),
    };

    // Create address
    const newAddress = await Address.create(addressToSave);

    res.json({ success: true, msg: "Address added", address: newAddress });
  } catch (error) {
    console.error(" Add Address Error:", error.message);
    res.status(500).json({ success: false, msg: error.message });
  }
};

// GET /api/address/get
export const getAddress = async (req, res) => {
  try {
    const { userId } = req.query;

    // Validate userId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, msg: "Invalid or missing userId" });
    }

    const addresses = await Address.find({
      userId: new mongoose.Types.ObjectId(userId),
    });

    res.json({ success: true, addresses });
  } catch (error) {
    console.error(" Get Address Error:", error.message);
    res.status(500).json({ success: false, msg: error.message });
  }
};
