const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
var methodOverride = require("method-override");
var flash = require("connect-flash");
const path = require("path");
const session = require("express-session");
const passport = require("passport");

//local routes
const about = require("./routes/about");
const ideas = require("./routes/idea");
const users = require("./routes/users");

//Passport Config
require("./config/passport")(passport);

const app = express();

mongoose
  .connect("mongodb://localhost:27017/vidjot-dev2", {
    useNewUrlParser: true
  })
  .then(() => {
    console.log("succesfully connected to mongodb");
  })
  .catch(() => {
    console.log("unable to connect to db");
  });

//express-session middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect-flash middleware
app.use(flash());

app.use(function sessionLimit(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

//handlebars middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
//body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//method-override middleware
app.use(methodOverride("_method"));

//static folder
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

app.use("/about", about);
app.use("/ideas", ideas);
app.use("/users", users);

const port = process.env.port || 3000;

app.listen(port, () => {
  console.log(`running app on ${port}`);
});
