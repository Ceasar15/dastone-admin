const express = require("express");
const db = require("../db/db.js")
const bcrypt = require('bcrypt')
const router = express.Router();
const passport = require("../passport.js")

// const { User } = require("../models/user");
// const Token = require("../models/token");
const sendEmail = require("../config/sendMail.js");



function loggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.render("views/user/auth-login");
}


// get auth register page
router.get("/auth-register", (req, res) => {
    res.render("views/user/auth-register");
});


// register user
router.post("/auth-register", async (req, res) => {
    let foundUser = await db.query('SELECT * FROM users WHERE username = $1', [req.body.username])
    console.log("username:", req.body.username);
    console.log("num", req.body.mobile_number)
    if (foundUser.rows[0]) {
        res.redirect('/auth/register')
    } else {
        let hashedPassword = await bcrypt.hash(req.body.password, 10)
        await db.query('INSERT INTO users (username, password, email, mobile_number) VALUES ($1, $2, $3, $4)', [req.body.username, hashedPassword, req.body.email, req.body.mobile_number])
        res.redirect('/auth/login')
    }
})


router.get('/auth/login', loggedIn, (req, res) => {
    console.log("login page ", req.isAuthenticated())
    res.render("views/user/auth-login");

})

router.get('/auth-recover-pw', (req, res) => {

    res.render("views/user/auth-recover-pw");

})

router.get('/auth-lock-screen', (req, res) => {
    // console.log(req.user.username)
    console.log("lock screen", req.isAuthenticated())
    res.render("views/user/auth-lock-screen");

})


// Add user to database.
router.post('/auth/login', function (req, res, next) {
    passport.authenticate('local',
        function (err, user, info) {
            if (err) {
                return res.redirect('/user/auth/login', {
                    errorMessage: err.message
                });
            }
            if (!user) {
                return res.redirect('/user/auth/login');
            }
            req.login(user, function(error) {
                if (error) return next(error);
                console.log("Request Login supossedly successful.");
                console.log("login page ", req.isAuthenticated())
                res.redirect('/')
             });
        })(req, res, next);
});


router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.status(400).send('Unable to log out')
            } else {
                res.redirect('/user/auth/login')
            }
        });
    } else {
        res.end()
    }
})

module.exports = router