//jshint esversion:6
require('dotenv').config()


const express = require("express");
// const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helmet");
const app = express();
const multer = require("multer");
const path = require("path")

const axios = require('axios');


app.use(express.json())
app.use(express.static("public"));
app.use(helmet());
app.use(morgan("common"));
app.use("/images",express.static(path.join(__dirname,"public/images")))



const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
// const { Headers } = require('node-fetch');



let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port, function() {
  console.log("Server started on port 8000");
});

const urlDB = process.env.MONGODB_URL;
mongoose.connect(urlDB, {useNewUrlParser : true},()=>{
  console.log("Connected to the database");
});



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,'public/images');
  },
  filename: (req,file,cb)=>{
    cb(null, req.body.name);
  }
});


const upload = multer({storage:storage});

app.post("/api/upload",upload.single('file'),(req,res)=>{
  try{
    return res.status(200).json("File has uploaded successfully");
  }catch(err){
    console.log(err);
  }
})


app.use("/api/users",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/posts",postRoute);
app.use('/api/conversations',conversationRoute);
app.use('/api/messages',messageRoute);

app.get("/", function(req,res){
  res.send("welcome to the home Page");
});



