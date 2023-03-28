const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require('mongoose');


app.use(express.json());
app.use(cors());


// Schema Design

const productSchema = mongoose.Schema({
  name: {
type: String,
required: [true, "Please provide a name for this product"],
trim: true,
unique: [true, "Name must be unique"],
minLength: [3, "Name must be at least 3 Character"],
maxLength: [100, "Name is too large, Max Length is 100 Character"]
  },

  description: {
type: String,
required: true ,
  },
  price: {
   type: Number,
   required: true,
   min: [0, "Price can not be negative"]
  },
  
    unit: {
      type: String,
      required:true,
      enum : ["kg", "litre", "pcs"]
    }
  
})



app.get("/", (req, res) => {
  res.send("Route is working! YaY!");
});


module.exports = app;
