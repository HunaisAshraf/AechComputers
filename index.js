const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const nocache = require("nocache");
const connectDB = require("./config/db");
const path = require("node:path");
const session = require("express-session");
const userRoute = require("./routes/userRoutes");
const adminRoute = require("./routes/adminRoute");
// const { applyProductOffer } = require("./helpers/offer");
// const categoryRoute = require("./routes/categoryRoute");
// const productRoute = require("./routes/productRoute");
// const cartRoute = require("./routes/cartRoute");

const app = express();

dotenv.config();

//connect to database
connectDB();

app.set("view engine", "ejs");

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(nocache());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// setInterval(()=>{
//   console.log("aaa")
// },3000)

app.use(express.static(path.join(__dirname, "/public")));
app.use("/edit-category", express.static("public"));
app.use("/edit-product", express.static("public"));
app.use("/product", express.static("public"));


// console.log();
//routes
app.use(userRoute);
app.use(adminRoute);
// app.use(categoryRoute);
// app.use(productRoute);
// app.use(cartRoute);

app.use("/*", (req, res) => {
  res.render("userPages/404", { signIn: req.session.signIn });
});

app.listen(process.env.PORT, () => {
  console.log(`server started in port ${process.env.PORT}`);
});
