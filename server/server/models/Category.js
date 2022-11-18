const mongoose = require("mongoose");

// schema
const categorySchema = new mongoose.Schema(
  {
    img: {
      type: String,
    },

    name: {
      type: String,
      require: true,
    },

    description: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

// model
const categoryModel = mongoose.model("Category", categorySchema);

// export
module.exports = categoryModel;
