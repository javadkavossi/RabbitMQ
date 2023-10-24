const { Router } = require("express");
const { productModel } = require("../model/product");
const { pushToQueue } = require("../config/rabbitmq");

const { createQueue } = require("../../order-service/config/rabbitmq");
const { isAuthenticated } = require("../../IsAuthenticated");

const productRouter = require("express").Router();

productRouter.post("/create", async (req, res, next) => {
  try {
    const { name, price, desc } = req.body;
    const newProduct = new productModel({ name, price, desc });
    await newProduct.save();
    return res.json({ message: "a new product Create ", product: newProduct });
  } catch (error) {
    next(error);
  }
});


productRouter.post("/buy",isAuthenticated, async (req, res, next) => {
  try {
    console.log("req");
    const { productIds = [] } = req.body;
    const products = await productModel.find({_id:{$in: productIds}})
    const {email} = req.user;
    await pushToQueue("ORDER" ,{products, userEmail : email} )
    const channel  = await createQueue("PRODUCT");
    channel.consume("PRODUCT" , msg =>{
      console.log(JSON.parse(msg.content.toString()));
 
    })

    return res.json({
        message : "your order created"
    })

  } catch (error) {
    next(error);
  }
});


module.exports = {
  productRouter,
};
