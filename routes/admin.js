const express = require("express");
const adminController = require("../controllers/admin");
const imageUploadMiddleware = require("../middleware/image-upload");
const router = express.Router();

router.get("/products", adminController.getProducts);
router.get("/products/new", adminController.getNewProduct);
router.post(
  "/products",
  imageUploadMiddleware,
  adminController.createNewProduct
);

module.exports = router;
