const mongoose = require("mongoose");



//ProductCart
const ProductCart = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,

  },

  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});


// schema
const orderSchema = new mongoose.Schema(
  {
    payed: {
      type: Boolean,
      require: true,
    },
    delivery: {
      type: Boolean,
      require: true,
    },
    deliveryDate: {
      type: Date,
    },
    pickUpDate: {
      type: Date,
    },
    shoppingCart: {
      type: [ProductCart],
      require: true,
    },
    userId: {
      type: mongoose.ObjectId,
      require: true,
    },
    paypalId: {
      type: String
    }
  },
  { timestamps: true }
);

// model
const orderModel = mongoose.model("Order", orderSchema);

// export
module.exports = orderModel;
