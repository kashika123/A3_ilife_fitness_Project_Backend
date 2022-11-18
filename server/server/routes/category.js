const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

// GET - get category by id -------------------------------------------------------
router.get("/:id", (req, res) => {
  Category.findById(req.params.id)
    .then((category) => {
      res.json(category);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Couldn't get category",
        error: err,
      });
    });
});

// GET - get categories -------------------------------------------------------
router.get("/", (req, res) => {
  Category.find(req.params.id)
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

// POST - create new category /
router.post("/", (req, res) => {
  // validate request
  if (Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .send({ message: "Category content can not be empty" });
  }

  const newCategoryData = req.body;

  // check account with email doen't already exist
  Category.findOne({ name: newCategoryData.name }).then((category) => {
    if (category) {
      return res.status(400).json({
        message: "Category name already exists, Please choose another name",
      });
    }
    // create new user
    const newCategory = new Category(newCategoryData);
    newCategory
      .save()
      .then((category) => {
        // success!
        return res.status(201).json({ catgory: category });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).send({
          message: "Problem creating category",
          error: err,
        });
      });
  });
});

module.exports = router;
