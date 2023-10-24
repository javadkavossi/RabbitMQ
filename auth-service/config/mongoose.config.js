const { default: mongoose } = require("mongoose");

mongoose.connect("mongodb://localhost:27017/auth-service")
  .then(() => {
    console.log("Connected to the auth-service DB!");
  })
  .catch((error) => {
    console.error("Error: Failed to connect to the auth-service DB", error);
  });