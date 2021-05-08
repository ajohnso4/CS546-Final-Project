const express = require("express");
const app = express();
const configRoutes = require('./routes');

const session = require("express-session");
const static = express.static(__dirname + "/public");
app.use("/public", static);

app.use(
  session({
    name: "AuthCookie",
    secret: "Secret Session",
    saveUninitialized: true,
    resave: false,
  })
);

app.use( async(req, res, next) =>{
    console.log("Current Timestamp: " +new Date().toUTCString());
    console.log("Request Method: " + req.method);
    console.log("Request Route: " + req.originalUrl);
    
    if(req.session.restaurant){
        console.log("Authenticated User")
    } else {
        console.log("Non-Authenticated User")
    }
    console.log()
    next();
});

app.use("/restaurants/register", (req, res, next) =>{
  if(!req.session.restaurant){
    res.status(403).render("restaurants/register", {layouts: false})
  } else {
    next();
  }
})

const exphbs = require("express-handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.json());

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
