const multer = require("multer");
const path = require("node:path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: function (req, file, cb) {
    const fileName = Date.now() + "-" + file.originalname;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;



const editProductController = async (req, res) => {
  try {
    const { productName, price, category, quantity, description, id } = req.body;

    // Process new images
    const newImages = req.files.map((file) => file.filename);

    // Process existing images to keep or remove
    const existingImages = req.body.existingImages ? req.body.existingImages.split(',') : [];
    const removedImages = req.body.removedImages ? req.body.removedImages.split(',') : [];

    // Remove images marked for removal
    const updatedImages = existingImages.filter(img => !removedImages.includes(img));

    // Add new images
    updatedImages.push(...newImages);

    // Update the product document with the new details including the updated image array
    await ProductModel.findByIdAndUpdate(id, {
      productName,
      price,
      category,
      quantity,
      description,
      images: updatedImages,
    });

    // Redirect to the product list page
    res.redirect("/product-list");
  } catch (error) {
    console.log(error);
    // Handle error response
    res.status(500).send("Internal Server Error");
  }
};
