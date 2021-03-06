// Imports
require('dotenv').config();
const express = require('express')
const app = express()
const port = 5000
const path = require("path")
const passport = require('passport');
const bodyParser = require("body-parser");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');


function loggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.render("views/user/auth-login");
}

// This allows us to pass data from the form
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.json());




// Set Cookie Parser, sessions and flash
let secret = process.env.secret
app.use(cookieParser(secret));
app.use(session({
    secret: secret,
    cookie: {
        httpOnly: true /*, secure: true*/
    },
    resave: true,
    saveUninitialized: true,
    rolling: true,
    cookie: {
        maxAge: 9000000,
        secure: false
    }

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


app.get('/', loggedIn, (req, res) => {
    console.log('home page', req.isAuthenticated())
    res.render("views/sales-index");
})


//routes config 
const usersRoute = require("./routes/user")
app.use("/user", usersRoute);



// 404 page handler
app.use(function(req,res){
    res.status(404).render("views/error/auth-404");
});

// 500 page handler
app.use(function(req,res){
    res.status(500).render("views/error/auth-500");
});
// Listen on Port 5000
app.listen(process.env.PORT || port, () => console.info(`App listening on port ${port}`))

module.exports = app