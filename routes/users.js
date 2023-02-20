const express = require("express");
const lodash = require("lodash");
const bcrypt = require("bcrypt");
const router = express.Router();
const auth = require("../middleware/auth");
const { User, validateUser } = require("../models/user");

router.get("/me", auth, async (req, res) => {
  const result = await User.findById(req.user._id).select("-password");
  res.send(result);
});

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered");
  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  res
    .header("x-auth-token", user.generateAuthToken())
    .send(lodash.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
