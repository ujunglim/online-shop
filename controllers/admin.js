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
    await product.save();
  } catch (err) {
    return next(err);
  }
  res.redirect("/admin/products");
}

// forward to update page with data
async function getUpdateProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    res.render("admin/products/update-product", { product });
  } catch (error) {
    return next(error);
  }
}

// update product
async function updateProduct(req, res, next) {
  const product = new Product({
    ...req.body,
    _id: req.params.id,
  });

  // update에서 이미지는 필수가 아님
  if (req.file) {
    // replace old image with the new one
    product.replaceImage(req.file.filename);
  }

  try {
    await product.save();
  } catch (error) {
    return next(error);
  }

  res.redirect("/admin/products");
}

module.exports = {
  getProducts,
  getNewProduct,
  createNewProduct,
  getUpdateProduct,
  updateProduct,
};
