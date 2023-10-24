const { default: mongose } = require("mongoose");
const orderSchema = new mongose.Schema(
  {
    products: [
      {
        _id: String,
      },
    ],
    userEmail : String,
    totalPrice: Number
  },
  { timestamps: true }
);
const orderModel = mongose.model("order", orderSchema);

module.exports = {
  orderModel,
};
