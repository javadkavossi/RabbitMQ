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

productRouter.post("/buy",isAuthenticated, async (req, res, next) => {
  try {

    // find data product in DB And push to Order Microservice 
    const { productIds = [] } = req.body;
    const products = await productModel.find({_id:{$in: productIds}})
    const {email} = req.user;

    // ----------> Sent(push) to Order Microservice 
    await pushToQueue("ORDER" ,{products, userEmail : email} )


    // -----------> Create gueue Product 
    const channel  = await createQueue("PRODUCT");


    // ---------- listen to Product Chanel for get data from Order Microservice 
 
    channel.consume("PRODUCT" ,async msg =>{
      console.log("message Product micro Servise : ",JSON.parse(msg.content.toString()));
       data = JSON.parse(msg.content.toString())

      setInterval(() => {
        return res.json({
            message : "your order created" , 
            data
        })
      }, 2500);

    })

  } catch (error) {
    next(error);
  }
});


module.exports = {
  productRouter,
};
