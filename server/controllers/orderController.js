import stripe from "stripe";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// =======================
// Place Order: STRIPE
// =======================

export const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    const { origin } = req.headers;

    if (!address || items.length === 0) {
      return res.json({ success: false, msg: "Invalid Data" });
    }

    let amount = 0;
    let productData = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      productData.push({
        name: product.name,
        price: product.offerPrice,
        quantity: item.quantity,
      });
      amount += product.offerPrice * item.quantity;
    }

    amount += Math.floor(amount * 0.02); // tax

    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Online",
    });

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    const line_items = productData.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.floor(item.price * 1.02 * 100), // includes 2% tax
      },
      quantity: item.quantity,
    }));

    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader?next=my-order`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId,
      },
    });

    // Optionally save Stripe session ID for tracking
    await Order.findByIdAndUpdate(order._id, { stripeSessionId: session.id });

    return res.json({
      success: true,
      url: session.url,
      msg: "Orders Placed Successfully",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// =======================
// Stripe Webhook Handler
// =======================

export const stripeWebhooks = async (req, res) => {
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
  const signature = req.headers["stripe-signature"];

  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOKS_SECRET
    );
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntentId = event.data.object.id;

      const sessionList = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      const session = sessionList.data[0];
      if (!session || !session.metadata) break;

      const { orderId, userId } = session.metadata;

      await Order.findByIdAndUpdate(orderId, { isPaid: true });
      await User.findByIdAndUpdate(userId, { cartItems: {} });

      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntentId = event.data.object.id;

      const sessionList = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      const session = sessionList.data[0];
      if (!session || !session.metadata) break;

      const { orderId } = session.metadata;

      await Order.findByIdAndDelete(orderId);
      break;
    }

    default:
      console.warn(`Unhandled event type ${event.type}`);
      break;
  }

  res.json({ received: true });
};

// =======================
// Place Order: COD
// =======================

export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address } = req.body;

    if (!address || items.length === 0) {
      return res.json({ success: false, msg: "Invalid Data" });
    }

    let amount = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      amount += product.offerPrice * item.quantity;
    }

    amount += Math.floor(amount * 0.02);

    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
    });

    return res.json({ success: true, msg: "Orders Placed Successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// =======================
// Get Orders by User ID
// =======================

export const getUserOrder = async (req, res) => {
  try {
    let userId;

    if (req.user && req.user.id) {
      userId = req.user.id.toString();
    } else if (process.env.NODE_ENV === "development" && req.query.userId) {
      userId = req.query.userId;
    } else {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const orders = await Order.find({
      userId: userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    return res.json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =======================
// Get All Orders (Admin)
// =======================

export const getAllOrder = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    return res.json({ success: true, orders });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
