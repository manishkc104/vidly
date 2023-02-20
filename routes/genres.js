const { Genre, validateGenres } = require("../models/genre");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/", async (req, res) => {
  const genre = await Genre.find().sort("name");
  res.send(genre);
});

router.post("/", auth, async (req, res) => {
  const result = validateGenres(req.body);
  if (result.error) {
    res.status(400).send(result.error);
    return;
  }
  const genre = new Genre({
    name: req.body.name,
  });
  const savedResult = await genre.save();
  res.send(savedResult);
});

router.put("/:id", async (req, res) => {
  const result = validateGenres(req.body);
  if (result.error) {
    res.status(400).send(result.error);
    return;
  }
  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  if (!genre) {
    res.status(404).send("The genre is not found");
    return;
  }
  res.send(genre);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre) {
    res.status(404).send("The genre is not found");
  }
  res.send(genre);
});

router.get("/:id", async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) {
    res.status(404).send("The genre is not found");
  }
  res.send(genre);
});

module.exports = router;
