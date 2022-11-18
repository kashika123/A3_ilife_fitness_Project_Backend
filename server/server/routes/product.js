const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET - get product by id -------------------------------------------------------
router.get("/:id", (req, res) => {
  Product.findById(req.params.id)
    .then((product) => {
      res.json(product);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Couldn't get product",
        error: err,
      });
    });
});

// GET - get products -------------------------------------------------------
router.get("/", (req, res) => {
  Product.find(req.params.id)
    .then((categories) => {
      res.json(categories);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Couldn't get categories",
        error: err,
      });
    });
});

// POST - create new product /
router.post("/", (req, res) => {
  // validate request
  if (Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .send({ message: "Product content can not be empty" });
  }

  const newCategoryData = req.body;

  // check account with email doen't already exist
  Product.findOne({ name: newCategoryData.name }).then((product) => {
    if (product) {
      return res.status(400).json({
        message: "Product name already exists, Please choose another name",
      });
    }
    // create new user
    const newCategory = new Product(newCategoryData);
    newCategory
      .save()
      .then((product) => {
        // success!
        return res.status(201).json({ catgory: product });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).send({
          message: "Problem creating product",
          error: err,
        });
      });
  });
});

module.exports = router;
