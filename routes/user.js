const express = require("express");
const router = express.Router();
//const csrf = require("csurf");


// router.get("/signup", middleware.isNotLoggedIn, (req, res) => {
//     var errorMsg = req.flash("error")[0];
//     res.render("user/signup", {
//         csrfToken: req.csrfToken(),
//         errorMsg,
//         pageName: "Sign Up",
//     });
// });

router.get("/auth-register", (req,res) => {
    // res.sendFile("/views/user/auth-register.html")
    res.render("views/user/auth-register");
});


module.exports = router;