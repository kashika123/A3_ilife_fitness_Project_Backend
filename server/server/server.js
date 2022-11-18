// dependencies------------------------------
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const schedule = require('node-schedule');
const axios = require("axios")
const cors = require("cors");
const job = require("./services/updateCurrenciesApi")
//const webhook = require('./services/paypalWebhook')
const port = process.env.PORT || 3001;
const fileUpload = require("express-fileupload");




// express app setup -----------------------
const app = express();

app.use(express.static('public'))
app.use(express.static('localstorage'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("*", cors());
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);

app.use('/localstorage', express.static('localstorage'))

// routes ---------------------------------

// auth
const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

// user
const userRouter = require("./routes/user");
app.use("/user", userRouter);

// Category
const categoryRouter = require("./routes/category");
app.use("/category", categoryRouter);

// Product
const productRouter = require("./routes/product");
app.use("/product", productRouter);

// Currencies
const currenciesRouter = require('./routes/currencies')
app.use("/currencies", currenciesRouter)

//Checkout
const checkoutRouter = require('./routes/checkout')
app.use('/checkout', checkoutRouter)


// ShoppingCart
const cartRouter = require("./routes/cart");
const { connectMongoose } = require("./services/db");
app.use("/cart", cartRouter)

// update currency MUR


// listen paypal event
//webhook
// run app listen on port --------------------
app.listen(port, () => {

  connectMongoose();
  console.log("App running on port ", port);
});
