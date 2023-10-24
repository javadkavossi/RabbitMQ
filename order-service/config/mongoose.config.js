const { default: mongoose } = require("mongoose");

mongoose.connect("mongodb://localhost:27017/order-service")
  .then(() => {
    console.log("Connected to the order-service DB!");
  })
  .catch((error) => {
    console.error("Error: Failed to connect to the order-service DB", error);
  });