const express = require("express");
const { productRouter } = require("./handler/product");
const app = express()
require("dotenv").config()
require("./config/mongoose.config")
const {PORT} = process.env
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/product" , productRouter)



app.use((req,res, next)=>{
return res.json({error: " Not found"})
})



app.use((error, req, res, next)=>{
    return res.json({error: error.message})
})
app.listen(PORT,()=>{
    console.log("Product-Service Runing over port : ", PORT);
})