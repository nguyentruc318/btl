const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const mutlter = require("multer");
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const { error } = require("console");

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
const Users = mongoose.model("Users", {
  name: {
    type: String,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
app.post("/signup", async (req, res) => {
  let checkUser = await Users.findOne({ email: req.body.email });
  if (checkUser) {
    return res.status(400).json({ success: false, error: "email da ton tai" });
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  const user = new Users({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });
  await user.save();
  const data = {
    user: {
      id: user.id,
    },
  };
  const token = jwt.sign(data, "secret_ecom");
  res.json({ success: true, token });
});
app.post("/login", async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, "secret_ecom");
      res.json({
        success: true,
        token,
      });
    } else {
      res.json({ success: false, error: "sai mat khau" });
    }
  } else {
    res.json({ success: false, error: "wrong email id" });
  }
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
app.get("/collection", async (req, res) => {
  let product = await Product.find({});
  let newCollection = product.slice(1).slice(-8);
  res.send(newCollection);
});
app.get("/bestseller", async (req, res) => {
  const product = await Product.find({});
  const bestSeller = product.slice(-4);
  res.send(bestSeller);
});
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ errors: "vui long xac thuc" });
  } else {
    try {
      const data = jwt.verify(token, "secret_ecom");
      req.user = data.user;
      next();
    } catch (err) {
      res.status(404).send({ error: "vui long xac thuc token" });
    }
  }
};
app.post("/addtocart", fetchUser, async (req, res) => {
  console.log(req.body, req.user);
  let userData = await Users.findOne({ _id: req.user.id });
  userData.cartData[req.body.itemId] += 1;
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.json({ message: "added" });
});
app.post("/removefromcart", fetchUser, async (req, res) => {
  console.log(req.body, req.user);
  let userData = await Users.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.itemId] > 0)
    userData.cartData[req.body.itemId] -= 1;
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.json({ message: "removed" });
});
app.get("/getcart", async (req, res) => {
  const userData = await Users.findOne({ _id: req.user.id });
  res.json(userData.cartData);
});
app.listen(port, (err) => {
  if (!err) {
    console.log("server ready on 4000");
  } else {
    console.log(err);
  }
});
