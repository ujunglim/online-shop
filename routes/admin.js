const express = require("express");
const adminController = require("../controllers/admin");
const imageUploadMiddleware = require("../middleware/image-upload");
const router = express.Router();

router.get("/products", adminController.getProducts);
// create
router.get("/products/new", adminController.getNewProduct);
router.post(
  "/products",
  imageUploadMiddleware,
  adminController.createNewProduct
);

// update product
router.get("/products/:id", adminController.getUpdateProduct);
router.post(
  "/products/:id",
  imageUploadMiddleware,
  adminController.updateProduct
);

module.exports = router;
