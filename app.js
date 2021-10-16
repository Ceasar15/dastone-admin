// Imports
const express = require('express')
const app = express()
const port = 5000
//const bodyParser = require("body-parser");
const path = require("path")
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

// This allows us to pass data from the form
app.use(express.urlencoded({extended: true}));
app.use(express.json());


//bodyparser returns middleware that only parses urlencoded bodies and only 
// looks at requests where the Content-Type header matches the type option.
app.use(bodyParser.urlencoded({
    extended: false
}));

// static files
app.use(express.static('assets'))
app.use('assets/css', express.static(path.join(__dirname + 'assets/css')))
app.use('assets/images', express.static(__dirname + 'assets/images'))
app.use('assets/js', express.static(path.join(__dirname, "assets/js")));


// Set View's
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);


app.get('/', (req, res) => {
    res.render("views/sales-index");
})


//routes config 
const usersRoute = require("./routes/user")
app.use("/user", usersRoute);

// Listen on Port 5000
app.listen(process.env.PORT || port, () => console.info(`App listening on port ${port}`))

module.exports = app;