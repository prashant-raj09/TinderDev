const express = require("express")

const app = express();


app.use("/test",(req,res)=>{
    res.send("Welcome from test....")
})
app.use("/",(req,res)=>{
    res.send("Welcome to dashboard....")
})



app.listen(7777,()=>{
    console.log("Server is runinng on port number 7777 ....")
})