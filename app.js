const express = require("express");
const app = express();
const configRoutes = require('./routes');
const cookieParser = require('cookie-parser');

const session = require("express-session");
const static = express.static(__dirname + "/public");
app.use("/public", static);

app.use(cookieParser());
app.use(session({
  name: 'AuthCookie',
  secret: 'some secret string!',
  resave: false,
  saveUninitialized: true,
}));

app.use( async(req, res, next) =>{
  let currentTimestamp = new Date().toUTCString();
  let requestMethod = req.method;
  let requestRoutes = req.originalUrl;
  let Authenticated;
  
  if(req.session.restaurant){
    Authenticated="Authenticated User"
  } else {
     Authenticated="Non-Authenticated User"
  }
  console.log(`[${currentTimestamp}]: ${requestMethod} ${requestRoutes} (${Authenticated})`)
  next();
});

app.use("/restaurants/login", (req, res, next) => {
  if (!req.session.restaurant && req.method === "GET") {
    return res.status(200).render("restaurants/login");
  } else {
    next();
  }
});


const exphbs = require("express-handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");
app.use(express.json());

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
