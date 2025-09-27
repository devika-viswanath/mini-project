import express from 'express';
import authUser from '../middleware/authUser.js';
import { placeOrderCOD, placeOrderStripe } from '../controllers/orderController.js';
import { getAllOrder, getUserOrder } from '../controllers/orderController.js';
import authSeller from '../middleware/authSeller.js';
const orderRouter = express.Router();


orderRouter.post("/cod",authUser, placeOrderCOD);
orderRouter.post("/stripe",authUser, placeOrderStripe); 
orderRouter.get("/user",authUser,getUserOrder  );
orderRouter.get("/seller",authSeller,getAllOrder)

export default orderRouter;