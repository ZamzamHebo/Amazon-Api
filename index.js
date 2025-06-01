const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const stripe = require("stripe")(process.env.STRIPE_KEY);
const app = express();

app.use(
  cors({
    origin: "https://silly-monstera-b64b7f.netlify.app",
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Success!",
  });
});

app.post("/payments/create", async (req, res) => {
  const total = parseInt(req.query.total);

  if (total > 0) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "usd",
      });

      res.status(201).json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      logger.error("Stripe error:", error);
      res.status(500).json({ error: "Payment failed" });
    }
  } else {
    res.status(403).json({
      message: "total must be greater than 0",
    });
  }
});

let port = 3000;
app.listen(port, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("listening");
  }
});
