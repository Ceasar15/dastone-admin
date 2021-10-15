// Imports
const express = require('express')
const app = express()
const port = 5000
const bodyParser = require("body-parser");
const path = require("path")

//bodyparser returns middleware that only parses urlencoded bodies and only 
// looks at requests where the Content-Type header matches the type option.
app.use(bodyParser.urlencoded({
    extended: false
}));

// static files
app.use(express.static('assets'))
app.use('assets/css', express.static(path.join(__dirname + 'assets/css')))
// app.use('/js', express.static(__dirname + 'assets/js'))
// app.use('/img', express.static(__dirname + 'assets/img'))
app.use('assets/js', express.static(path.join(__dirname, "assets/js")));


// Set View's
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);


//routes config 
const usersRoute = require("./routes/user")
app.use("/user", usersRoute);

// Listen on Port 5000
app.listen(process.env.PORT || port, () => console.info(`App listening on port ${port}`))

module.exports = app;