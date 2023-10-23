const express = require("express");
const { productRouter } = require("./handler/auth");
const app = express()
require("dotenv").config()
const {PORT} = process.env
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use((req,res, next)=>{
return res.json({error: " Not found"})
})


app.use("/product" , productRouter)

app.use((error, req, res, next)=>{
    return res.json({error: error.message})
})