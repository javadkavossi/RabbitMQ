const express = require("express");
const { authRouter } = require("./handler/auth");
const app = express()
require("dotenv").config()
const {PORT} = process.env
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("auth", authRouter)

app.use((req,res, next)=>{
return res.json({error: " Not found"})
})

app.use((error, req, res, next)=>{
    return res.json({error: error.message})
})