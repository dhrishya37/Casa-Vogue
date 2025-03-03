const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const passport = require('./config/passport'); 
const connectDB = require('./config/db');
const path = require('path');
const session = require('express-session');
const userRoutes = require('./router/userRoutes');
const adminRoutes = require('./router/adminRoutes');
const bodyParser = require("body-parser");

const app = express();
connectDB();

app.use(express.static('public'));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json({ limit: "50mb" })); 
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.set('views', path.join(__dirname, 'views'));

app.use(session({ secret: 'your-secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');
app.use(userRoutes);
app.use(adminRoutes);

const port = 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
