const express = require("express");
const db = require("../db/db.js")
const bcrypt = require('bcrypt')
const router = express.Router();

const passport = require("../passport.js")


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


router.get('/auth/login', alreadyAuthenticated, (req, res) => {
    res.render("views/user/auth-login");

})

// Add user to database.
router.post('/auth/login', function(req, res, next) {
    passport.authenticate('local',
    function(err, user, info) {
        if (err) {
            console.log('two')
            return res.redirect('/user/auth/login', {errorMessage: err.message });
        }
        if (!user) {
            // console.log('three', info.message)
            return res.redirect('/user/auth/login');
        }
        return res.redirect('/')
        // return req.logIn(user, function(err) {
        //     if (err) {
        //         console.log('four')
        //         return res.redirect('/user/auth/login');
        //     } else {
        //         console.log('one')
        //         return res.redirect('/');
        //     }
        // });
    })(req, res, next);
});


// router.post('/auth/login', (req, res) => {
//     passport.authenticate('local', function (err, user, info) {      
//         if (err) {
//             return res.status(401).json(err);
//         }
//         if (user) {
//             // const token = user.generateJwt();
//             return res.status(200).redirect('/');
//         } else {
//             res.status(401).json(info);
//         }
//     })(req, res)
// })


// router.post('/auth/login', passport.authenticate('local', {
//     failureRedirect: '/user/auth/login',
//     successRedirect: '/',
//     failureMessage: true
//     } 
//     , function(err, user, info) {
//         if (err) {
//             return res.render('signin', { title: 'Sign In', errorMessage: err.message });
//         }

//         if (!user) {
//             return res.render('signin', { title: 'Sign In', errorMessage: info.message });
//         }

//         return req.logIn(user, function(err) {
//             if (err) {
//                 return res.render('signin', { title: 'Sign In', errorMessage: err.message });
//             } else {
//                 return res.redirect('/');
//             }
//         });
//     })(req, res, next));


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