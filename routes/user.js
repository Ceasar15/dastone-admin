const express = require("express");
const db = require("../db/db.js")
const bcrypt = require('bcrypt')
const router = express.Router();

const passport = require("../passport.js")


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


router.get('/auth/login', alreadyAuthenticated, (req, res) => {
    res.render("views/user/auth-login");

})

// Add user to database.
router.post('/auth/login', function(req, res, next) {
    passport.authenticate('local',
    function(err, user, info) {
        if (err) {
            return res.redirect('/user/auth/login', {errorMessage: err.message });
        }
        if (!user) {
            return res.redirect('/user/auth/login');
        }
        return res.redirect('/')
    })(req, res, next);
});

router.get('/logout', (req, res, next) => {
    if (req.isAuthenticated()) {
        req.logout()
        res.redirect('/auth/login')
    } else {
        res.redirect('back')
    }
})

function alreadyAuthenticated(req, res, next) {
    if ( req.isAuthenticated ) {
        res.redirect('back')
    } else {
        next()
    }
}


module.exports = router