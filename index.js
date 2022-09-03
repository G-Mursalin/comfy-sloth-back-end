const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const stripe = require("stripe")(process.env.REACT_APP_STRIPE_SECRET_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Payment
app.post("/create-payment-intent", async (req, res) => {
  const { items, shippingAmount } = req.body;

  const amount = items.reduce(
    (previousValue, currentValue) => previousValue + currentValue.subTotal,
    0
  );

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount + shippingAmount,
    currency: "usd",
    payment_method_types: ["card"],
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.get("/", (req, res) => {
  res.send("Hello World from Comfy Sloth");
});

app.listen(port, () => {
  console.log(`Comfy Sloth listening on port ${port}`);
});
