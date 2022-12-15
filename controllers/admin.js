function getProducts(req, res) {
  res.render("admin/products/all-products");
}

function getNewProduct(req, res) {
  res.render("admin/products/new-product");
}

function createNewProduct(req, res) {
  console.log(req.body, req.file);
  // get data and store to db
  res.redirect("/admin/products");
}

module.exports = {
  getProducts,
  getNewProduct,
  createNewProduct,
};
