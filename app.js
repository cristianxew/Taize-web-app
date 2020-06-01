const dotenv = require("dotenv").config();

const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  flash = require("connect-flash"),
  passport = require("passport"),
  localStrategy = require("passport-local"),
  methodOverride = require("method-override"),
  testimony = require("./models/testimony"),
  comment = require("./models/comment"),
  User = require("./models/user"),
  seedDB = require("./seeds"),
  nodemailer = require("nodemailer"),
  events = require("events");
var path = require("path");

//requiring routes
const commentRoutes = require("./routes/comments"),
  testimoniesRoutes = require("./routes/testimonies"),
  indexRoutes = require("./routes/index");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useCreateIndex: true,
    autoIndex: false,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connection  Successfully!"))
  .catch((err) => {
    console.log(err);
  });
//schema set up/v3  comming from models

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//app.use(express.static(__dirname + "/public"));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //seed the database

//PASSPORT CONFIGURATIONS
app.use(
  require("express-session")({
    secret: process.env.PASSPORT_SECRET_CODE,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Habilitando la variable currentUser en todas las rutas para manejar cuando se muestra el login, sign up y logout
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.msg = "smg";
  res.locals.page = "show";
  next();
});

app.use(indexRoutes);
app.use("/inicio", testimoniesRoutes);
app.use("/inicio/:id/comments", commentRoutes);

app.listen(3000, function () {
  console.log("Vol-Taz-app has started");
});
