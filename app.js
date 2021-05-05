const express = require("express");
const app = express();
const configRoutes = require('./routes');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());
app.use(session({
  name: 'AuthCookie',
  secret: 'some secret string!',
  resave: false,
  saveUninitialized: true,
}));
configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
