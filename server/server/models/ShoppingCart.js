const { Schema, Decimal128 } = require("mongoose");
const mongoose = require("mongoose");
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




//Utils
const notEmptyRan = [];
var notEmpty = function (columns) {
  if (columns.length === 0) { notEmptyRan.push(false); return false; }
  else { notEmptyRan.push(true); return true; }
};
// schema
const shoppingCartSchema = new mongoose.Schema(
  {
    checkedout: {
      type: Boolean
    },
    userId: {
      type: mongoose.ObjectId,
      required: true
    },


    products:
    {
      type: [ProductCart],
      required: true
    },

    totalPrice:
    {
      type: Number
    }
    ,
    totalPriceUSD: {
      type: Decimal128,
      require: true
    }
  },
  { timestamps: true }
);

// model
const shoppingCartModel = mongoose.model("ShoppingCart", shoppingCartSchema);

// export
module.exports = shoppingCartModel;
