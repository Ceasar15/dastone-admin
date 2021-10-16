// Imports
const express = require('express')
const app = express()
const port = 5000
const path = require("path")
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

// This allows us to pass data from the form
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());


// Set Cookie Parser, sessions and flash
app.use(cookieParser('NotSoSecret'));
app.use(session({
    secret: 'something',
    cookie: {
        maxAge: 60000
    },
    resave: true,
    saveUninitialized: true
}));
app.use(flash());

// Init passport authentication 
app.use(passport.initialize());
// persistent login sessions 
app.use(passport.session());

// static files
app.use(express.static('assets'))
app.use('assets/css', express.static(path.join(__dirname + 'assets/css')))
app.use('assets/images', express.static(__dirname + 'assets/images'))
app.use('assets/js', express.static(path.join(__dirname, "assets/js")));


// Set View's
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);


app.get('/', checkNotAuthenticated, (req, res) => {
    res.render("views/sales-index");
})


function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.render("views/user/auth-login");
  }
  


//routes config 
const usersRoute = require("./routes/user")
app.use("/user", usersRoute);

// Listen on Port 5000
app.listen(process.env.PORT || port, () => console.info(`App listening on port ${port}`))

module.exports = app;