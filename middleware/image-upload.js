const multer = require("multer");
const uuid = require("uuid").v4;

// multer config storage(destination, filename)
const upload = multer({
  storage: multer.diskStorage({
    destination: "product-data/images", // place to save img
    filename: function (req, file, cb) {
      cb(null, uuid() + "-" + file.originalname);
    },
  }),
});

// get single file, "image" is name of input. return actual middleware func
const configuredMiddleware = upload.single("image");

module.exports = configuredMiddleware;
