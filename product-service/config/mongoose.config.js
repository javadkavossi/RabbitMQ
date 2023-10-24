const { default: mongoose } = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Product-service")
  .then(() => {
    console.log("Connected to the Product-service DB!");
  })
  .catch((error) => {
    console.error("Error: Failed to connect to the Product-service DB", error);
  });