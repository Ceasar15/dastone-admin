const express = require("express");
const router = express.Router();
const passport = require("../passport.js")

// get auth register page
router.get("/auth-register", (req,res) => {
    // res.sendFile("/views/user/auth-register.html")
    res.render("views/user/auth-register");
});


// register user
router.post("/auth-register", (req, res) => {

})


module.exports = router;