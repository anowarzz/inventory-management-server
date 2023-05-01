const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

app.use(express.json());
app.use(cors());

// Schema Design

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name for this product"],
      trim: true,
      unique: [true, "Name must be unique"],
      minLength: [3, "Name must be at least 3 Character"],
      maxLength: [100, "Name is too large, Max Length is 100 Character"],
    },

    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price can not be negative"],
    },

    unit: {
      type: String,
      required: true,
      enum: {
        values: ["kg", "litre", "pcs"],
        message: "unit value can't be ${VALUE}, must be kg/litre/pcs",
      },
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, "Quantity can't be negative"],
      validate: {
        validator: (value) => {
          const isInteger = Number.isInteger(value);
          if (isInteger) {
            return true;
          } else {
            return false;
          }
        },
      },
      message: "Quantity must be an integer",
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["in-stock", "out-of-stock", "discontinued"],
        message: "Status can't be ${VALUE}",
      },
    },
    // createdAt: {
    //   type: Date,
    //   default: Date.now
    // },
    // updatedAt: {
    //   default: Date.now
    // },
    // supplier: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Supplier"
    // },
    // categories: [{
    //    name: {
    //     type: String,
    //     required: true,
    //    },
    //    _id: mongoose.Schema.Types.ObjectId
    // }]
  },
  {
    timestamps: true,
  }
);

// mongoose middleware for saving : pre
productSchema.pre("save", function (next) {
  console.log("Before saving data");
  if (this.quantity === 0) {
    this.status = "out-of-stock";
  }
  next();
});

// mongoose middleware for saving : post
productSchema.post("save", function (doc, next) {
  console.log("after saving saving data");
  next();
});

// creating a custom instance method

productSchema.methods.logger = function () {
  console.log(`Data saved for ${this.name}`);
};

// SCHEMA => MODEL => QUERY
const Product = mongoose.model("Product", productSchema);

// get route
app.get("/", (req, res) => {
  res.send("Route is working! YaY!");
});




// post route to save a data
app.post("/api/v1/product", async (req, res, next) => {
  try {
    // instance method = Do something ==> save () ;
    //     const product = new Product(req.body)
    //  const result = await product.save()

    // direct save/create method
    const result = await Product.create(req.body);
    result.logger();

    res.status(200).json({
      status: "success",
      message: "Data inserted successfully ",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Data is not inserted",

      error: error.message,
    });
  }
});

module.exports = app;
