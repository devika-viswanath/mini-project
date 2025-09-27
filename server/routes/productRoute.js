import express from "express";
import { addProduct, changeStock, productById, productList } from "../controllers/productController.js";
import { upload } from "../configs/multer.js";
import authSeller from "../middleware/authSeller.js";

const productRouter = express.Router();

productRouter.get("/list",productList)
productRouter.get("/id",productById)
productRouter.post("/add", upload.array(["images" ]),authSeller,addProduct)
productRouter.post("/stock",authSeller,changeStock)

export default productRouter;