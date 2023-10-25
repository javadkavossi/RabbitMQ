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



// ---------------------> get requset from client

productRouter.post("/buy", isAuthenticated, async (req, res, next) => {
  try {
    // find data product in DB And push to Order Microservice
    const { productIds = [] } = req.body;
    const products = await productModel.find({ _id: { $in: productIds } });
    const { email } = req.user;

    // ----------> Sent(push) to Order Microservice
    await pushToQueue("ORDER", { products, userEmail: email });

    // -----------> Create gueue Product
    const { channel, queueDetails } = await createQueue("PRODUCT");

    console.log("queueDetails", queueDetails);

    // ---------- listen to Product Chanel for get data from Order Microservice

    let order = [];

    let index = 0;
    channel.consume("PRODUCT", async (msg) => {
    
      order.push(JSON.parse(msg.content.toString()));
      console.log(
        "message Product micro Servise : ",
        // JSON.parse(msg.content.toString())
        index,
        queueDetails.messageCount
      );
      // if (index == queueDetails.messageCount) {
      //   res.json({
      //     message: "your order created",
      //     products,
      //   });
      // }
      channel.ack(msg);
      // index++;
    });

    
      res.json({
        message: "your order created",
        data: products,
      });
    
  } catch (error) {
    next(error);
  }
});

module.exports = {
  productRouter,
};
