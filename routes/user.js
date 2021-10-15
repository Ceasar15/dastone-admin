const express = require("express");
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
    if (foundUser.rows[0]) {
        res.redirect('/auth/register')
    }
})


module.exports = router;