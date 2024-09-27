const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const mutlter = require("multer");
const path = require("path");
const cors = require("cors");
const multer = require("multer");
// const { type } = require("os");

app.use(express.json());
app.use(cors());
//mongodb+srv://truc2003:<db_password>@cluster0.3cnkd.mongodb.net/
// database connection wwith mongoodb
mongoose.connect(
  "mongodb+srv://truc2003:truc3108@cluster0.3cnkd.mongodb.net/webbtl"
);
//tạo api
app.get("/", (req, res) => {
  res.send("app is running");
});

// image storage
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({ storage: storage });
// taọ upload enpoint cho ảnh
app.use("/images", express.static("upload/images"));
app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});
// tạo schema cho product
const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
});
// post product leen
app.post("/addproduct", async (req, res) => {
  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    id = 1;
  }
  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });
  await product.save();
  res.json({
    success: true,
    name: req.body.name,
    // id: res.body.id,
  });
});
// api để delete product
app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  res.json({
    success: true,
    name: req.body.name,
  });
});
// api dểd lấy hết product
app.get("/allproducts", async (req, res) => {
  let products = await Product.find({});
  res.send(products);
});
app.listen(port, (err) => {
  if (!err) {
    console.log("server ready on 4000");
  } else {
    console.log(err);
  }
});
