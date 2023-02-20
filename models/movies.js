const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("../models/genre");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
  },
  dailyRentalService: {
    type: Number,
    required: true,
    min: 0,
  },
  genre: {
    type: genreSchema,
    required: true,
  },
});

const Movies = mongoose.model("Movies", movieSchema);

const validateMovie = (movie) => {
  const schema = {
    title: Joi.string().min(2).max(255).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().required(),
    dailyRentalService: Joi.number().required(),
  };

  return Joi.validate(movie, schema);
};

exports.Movies = Movies;
exports.movieSchema = movieSchema;
exports.validateMovie = validateMovie;
