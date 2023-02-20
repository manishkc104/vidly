const Joi = require("joi");
const mongoose = require("mongoose");

const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    isGold: {
      type: Boolean,
      default: false,
    },
  })
);

const validateCustomer = (cusomter) => {
  const schema = {
    name: Joi.string().min(3).required(),
    phone: Joi.string().min(10).required(),
    isGold: Joi.boolean(),
  };
  return Joi.validate(cusomter, schema);
};

exports.Customer = Customer;
exports.validateCustomer = validateCustomer;
