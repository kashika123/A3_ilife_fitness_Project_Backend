const mongoose = require("mongoose");

// schema
const productSchema = new mongoose.Schema(
  {
    img: {
      type: String,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
    normalPrice: {
      type: Number,
      require: true,
    },
    promotionPrice: {
      type: Number,
    },
    isNewArrival: {
      type: Boolean,
    },
    categoryId: {
      type: mongoose.ObjectId,
      require: true,
    },
  },
  { timestamps: true }
);

// model
const productModel = mongoose.model("Product", productSchema);

// export
module.exports = productModel;
