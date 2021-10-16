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


router.get('/auth/login', checkAuthenticated, (req, res) => {
    res.render("views/user/auth-login");

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
            return res.redirect('/')
        })(req, res, next);
});


// router.get('/logout', logout());
// DELETE /api/auth/logout
router.get('/logout', (req, res) => {
    console.log('logouuuttt', req.session)
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


// router.get('/logout', (req, res) => {
//     console.log('logouuuttt', req.session)
//     req.logout();
//     req.user=null
//     res.redirect('/auth/login')
// })


// function alreadyAuthenticated(req, res, next) {
//     if (req.isAuthenticated())  // <-- typo here
//         return next();
//     res.redirect('/');
// }

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        //res.redirect("/")
        return next();
    }
    res.render("views/user/auth-login");
}

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    next();
}

module.exports = router