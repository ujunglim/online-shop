const mongodb = require("mongodb");

const db = require("../data/database");

class Product {
  constructor(productData) {
    this.title = productData.title;
    this.summary = productData.summary;
    this.price = +productData.price;
    this.description = productData.description;

    this.image = productData.image; // name of image file
    this.updateImageData();
    // if create new product don't need to have id
    if (productData._id) {
      this.id = productData._id.toString();
    }
  }

  static async getAllProducts() {
    const products = await db.getDb().collection("products").find().toArray();
    // adding imagePath, imageUrl to product which are from db (cuz db only have image name)
    return products.map((product) => {
      return new Product(product);
    });
  }

  static async findById(productId) {
    let prodId;
    try {
      prodId = new mongodb.ObjectId(productId);
    } catch (err) {
      err.code = 404;
      throw err;
    }
    const product = await db
      .getDb()
      .collection("products")
      .findOne({ _id: prodId });

    if (!product) {
      const error = new Error("Could not find product with provided id");
      error.code = 404;
      throw error;
    }
    return new Product(product);
  }

  async save() {
    const productData = {
      title: this.title,
      summary: this.summary,
      price: this.price,
      description: this.description,
      image: this.image,
    };

    // update
    if (this.id) {
      const productId = mongodb.ObjectId(this.id);

      // check image
      if (!this.image) {
        delete productData.image; // delete key, value from the object
      }

      await db.getDb().collection("products").updateOne(
        { _id: productId },
        {
          $set: productData,
        }
      );
    }
    // create new product
    else {
      await db.getDb().collection("products").insertOne(productData);
    }
  }

  updateImageData() {
    this.imagePath = `product-data/images/${this.image}`;
    this.imageUrl = `/product/assets/images/${this.image}`;
  }

  replaceImage(newImageName) {
    this.image = newImageName;
    this.updateImageData();
  }
}

module.exports = Product;
