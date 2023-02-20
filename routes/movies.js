const { Movies, validateMovie } = require("../models/movies");
const express = require("express");
const { Genre } = require("../models/genre");
const router = express.Router();

router.get("/", async (req, res) => {
  const result = await Movies.find().sort("title");
  res.send(result);
});

router.post("/", async (req, res) => {
  const validate = validateMovie(req.body);
  if (validate.error) {
    res.status(400).send(validate.error);
    return;
  }

  const genre = Genre.findById(req.body.genreId);
  if (!genre) {
    res.status(400).send("Invalid genre");
    return;
  }
  const movie = new Movies({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    dailyRentalService: req.body.dailyRentalService,
    numberInStock: req.body.numberInStock,
  });

  const result = await movie.save();
  res.send(result);
});

router.put("/:id", async (req, res) => {
  const genre = Genre.findById(req.body.genreId);
  if (!genre) {
    res.status(400).send("Invalid genre");
    return;
  }
  const movie = await Movies.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      dailyRentalService: req.body.dailyRentalService,
      numberInStock: req.body.numberInStock,
    },
    { new: true }
  );
  if (!movie) {
    res.status(404).send("The movie is not found");
    return;
  }
  res.send(movie);
});

router.delete("/:id", async (req, res) => {
  const result = await Movies.findByIdAndRemove(req.params.id);
  res.send(result);
});

router.get("/:id", async (req, res) => {
  const result = await Movies.findById(req.params.id);
  res.send(result);
});

module.exports = router;
