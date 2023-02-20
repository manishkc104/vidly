const Joi = require("joi");
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLlength: 5,
    maxlength: 50,
  },
  phone: {
    type: String,
    required: true,
  },
  isGold: {
    type: Boolean,
    default: false,
  },
});

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  dailyRentalService: {
    type: Number,
    required: true,
    min: 0,
  },
});

const Rental = mongoose.model(
  "Rental",
  new mongoose.Schema({
    customer: {
      type: customerSchema,
      required: true,
    },
    movie: {
      type: movieSchema,
      required: true,
    },
    dateOut: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dateReturned: {
      type: Date,
    },
    rentalFee: {
      type: Number,
      min: 0,
    },
  })
);

const validateRental = (rental) => {
  const schema = {
    //checking whether the objectid is correct or not
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  };
  return Joi.validate(rental, schema);
};

exports.validateRental = validateRental;
exports.Rental = Rental;
