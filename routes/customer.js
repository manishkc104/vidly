const { Customer, validateCustomer } = require("../models/customer");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const customer = await Customer.find();
  res.send(customer);
});

router.post("/", async (req, res) => {
  const result = validateCustomer(req.body);
  if (result.error) {
    res.status(400).send(result.error);
    return;
  }
  const customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });

  const savedResult = await customer.save();
  res.send(savedResult);
});

router.get("/:id", async (req, res) => {
  const result = await Customer.findById(req.params.id);
  if (!result) {
    res.status(404).send("The customer is not found");
  }
  res.send(result);
});

router.put("/:id", async (req, res) => {
  const result = validateCustomer(req.body);
  if (result.error) {
    res.status(400).send(result.error);
    return;
  }
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold,
    },
    { new: true }
  );
  if (!customer) {
    res.status(404).send("The customer is not found");
    return;
  }
  res.send(customer);
});

router.delete("/:id", async (req, res) => {
  const result = await Customer.findByIdAndRemove(req.params.id);
  res.send(result);
});

module.exports = router;
