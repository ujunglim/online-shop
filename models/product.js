const db = require("../data/database");

class Product {
  constructor(productData) {
    this.title = productData.title;
    this.summary = productData.summary;
    this.price = +productData.price;
    this.description = productData.description;

    this.image = productData.image; // name of image file
    this.imagePath = `product-data/images/${productData.image}`;
    this.imageUrl = `/product/assets/images/${productData.image}`;
    // if create new product don't need to have id
    if (productData._id) {
      this.id = productData._id.toString();
    }
  }

  static async getAllProducts() {
    const products = await db.getDb().collection("products").find().toArray();
    // adding imagePath, imageUrl to product which are from db (cuz db only have image name)
    return products.map((p) => {
      return new Product(p.productData);
    });
  }

  async createProduct() {
    const productData = {
      title: this.title,
      summary: this.summary,
      price: this.price,
      description: this.description,
      image: this.image,
    };

    await db.getDb().collection("products").insertOne({ productData });
  }
}

module.exports = Product;
