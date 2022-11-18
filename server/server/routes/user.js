const express = require("express");
const router = express.Router();
const Utils = require("./../utils");
const User = require("./../models/User");
const path = require("path");
const { generateAccessToken, cleanObject } = require("./../utils");

// update User
const updateUser = (id, update) => {
  const userToUpdate = cleanObject(update);
  console.log("updating USER -> ", userToUpdate);
  return User.findByIdAndUpdate(
    { _id: id },
    { $set: userToUpdate },
    { new: true }
  );
};

// GET - get single user -------------------------------------------------------
router.get("/:id", Utils.authenticateToken, (req, res) => {
  if (req.user._id != req.params.id) {
    return res.status(401).json({
      message: "Not authorised",
    });
  }

  User.findById(req.params.id)
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Couldn't get user",
        error: err,
      });
    });
});

// PUT - update user ---------------------------------------------
router.put("/:id", Utils.authenticateToken, (req, res) => {
  // validate request
  if (!req.body) return res.status(400).send("Task content can't be empty");

  const { id } = req.params;
  const updateUserData = req.body;

  console.log("updateUserData->", updateUserData);

  // if avatar image exists, upload!
  if (req.files && req.files.avatar) {
    // upload avater image then update user
    const uploadPath = path.join(__dirname, "..", "public", "images");
    Utils.uploadFile(req.files.avatar, uploadPath, (uniqueFilename) => {
      // update user with all fields including avatar
      updateUser(id, {
        firstName: updateUserData.firstName,
        lastName: updateUserData.lastName,
        avatar: uniqueFilename,
      })
        .then((updatedUser) => {
          return res.status(200).json(updatedUser);
        })
        .catch((err) => {
          console.warn(err);
          return res.status(500).json({
            message: "Problem updating user",
            error: err,
          });
        });
    });
  } else {
    // update user without avatar
    updateUser(id, {
      firstName: updateUserData.firstName,
      lastName: updateUserData.lastName,
      email: updateUserData.email,
    })
      .then((updatedUser) => {
        return res.status(200).json(updatedUser);
      })
      .catch((err) => {
        console.warn(err);
        return res.status(500).json({
          message: "Problem updating user",
          error: err,
        });
      });
  }
});

// POST - create new user / Sign-up--------------------------------------
router.post("/", (req, res) => {
  // validate request
  if (Object.keys(req.body).length === 0) {
    return res.status(400).send({ message: "User content can not be empty" });
  }

  const newUserData = req.body;

  // check account with email doen't already exist
  User.findOne({ email: newUserData.email }).then((user) => {
    if (user) {
      return res.status(400).json({
        message: "email already in use, use different email address",
      });
    }
    // create new user
    const newUser = new User(newUserData);
    newUser
      .save()
      .then((user) => {
        // success!
        // return 201 status with user object

        const accessToken = generateAccessToken({ _id: user._id }); // to keep the user connected after the sign-up
        return res.status(201).json({ user, accessToken });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).send({
          message: "Problem creating account",
          error: err,
        });
      });
  });
});

module.exports = router;
