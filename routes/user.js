const express = require("express");
const router = express.Router();
const passport = require("../passport.js")
const db = require("../db/db.js")
const bcrypt = require('bcrypt')

// console.log(db)



// get auth register page
router.get("/auth-register", (req, res) => {
    // res.sendFile("/views/user/auth-register.html")
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


router.get('/auth/login', alreadyAuthenticated, (req, res, next) => {
    // res.render('auth.ejs', {
    //     title: 'Login',
    //     route: '/auth/login'
    // })
    res.render("views/user/auth-login");

})

router.post('/auth/login', passport.authenticate('local', {
    failureRedirect: '/user/auth/login',
    successRedirect: '/',
    failureMessage: true
}));


router.get('/logout', (req, res, next) => {
    if (req.isAuthenticated()) {
        req.logout()
        res.redirect('/')
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