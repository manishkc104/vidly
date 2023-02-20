const express = require("express");
const router = express.Router();
const { Rental, validateRental } = require("../models/rentals");
const { Movies } = require("../models/movies");
const { Customer } = require("../models/customer");
const Fawn = require("fawn");
const mongoose = require("mongoose");

Fawn.init(mongoose);

router.get("/", async (req, res) => {
  const result = await Rental.find().sort("-dateOut");
  res.send(result);
});

router.post("/", async (req, res) => {
  const validate = validateRental(req.body);
  if (validate.error) {
    res.status(400).send(validate.error);
    return;
  }

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("customer not found");

  const movie = await Movies.findById(req.body.movieId);
  if (!movie) return res.status(400).send("movie not found");

  if (movie.numberInStock === 0)
    return res.status(400).sendFile("cannot find movie for rent");

  const rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      isGold: customer.isGold,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalService: movie.dailyRentalService,
    },
  });

  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update(
        "movies",
        { _id: movie._id },
        {
          $inc: { numberInStock: -1 },
        }
      )
      .run();
    res.send(rental);
  } catch (ex) {
    res.status(500).send("something went wrong");
  }
});

module.exports = router;
