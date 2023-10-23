const express = require("express");
const { orderRouter } = require("./handler/auth");
const app = express();
require("dotenv").config();
const { PORT } = process.env;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  app.use("/order", orderRouter);

  return res.json({ error: " Not found" });
});

app.use((error, req, res, next) => {
  return res.json({ error: error.message });
});
