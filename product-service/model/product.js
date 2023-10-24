const { default: mongose } = require("mongoose");
const productSchema = new mongose.Schema(
  {
    name: String,
    desc: String,
    price: Number,
  },
  { timestamps: true }
);
const productModel = mongose.model("product", productSchema);

module.exports = {
  productModel,
};
