const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const colors = require("colors");


const app = require("./app");



// database connection
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log(`Database connection is successful`.yellow.bold);
})
.catch(err => {
  console.log(err);
})



// server
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`App is running on port ${port}`.red.bold);
});

