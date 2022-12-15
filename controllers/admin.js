const Product = require("../models/product");

async function getProducts(req, res, next) {
  try {
    const products = await Product.getAllProducts();
    res.render("admin/products/all-products", { products });
  } catch (err) {
    return next(err);
  }
}

function getNewProduct(req, res) {
  res.render("admin/products/new-product");
}

async function createNewProduct(req, res, next) {
  const product = new Product({
    ...req.body,
    image: req.file.filename,
  });

  try {
    await product.createProduct();
  } catch (err) {
    return next(err);
  }
  res.redirect("/admin/products");
}

module.exports = {
  getProducts,
  getNewProduct,
  createNewProduct,
};
