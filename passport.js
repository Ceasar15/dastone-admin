const passport = require('passport');
const db = require("./db/db.js");
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt')


passport.serializeUser((user, done) => {
    done(null, user.id)
})


passport.deserializeUser(async (userID, done) => {
    try {
        let foundUser = await db.query('SELECT * FROM users WHERE id = $1', [userID])
        done(null, foundUser.rows[0])
    } catch (err) {
        done(err, false)
    }
})


passport.use(new localStrategy( async function(username, password, done) {

    db.query(`SELECT * FROM users WHERE username = $1`, [username]).then(res =>
    {
        var user = res.rows[0];
        if (user === undefined ) {
            console.log('Invalid username or password')
            return done(null, false, { message: 'Invalid username or password' });
        } 
        else {
            if (!bcrypt.compareSync(password, res.rows[0].password)) {
                console.log("Invalid Password")
                return done(null, false, { message: 'Invalid password' });
            } else {
                console.log('User Found')
                return done(null, user);
            }
        }
    }).catch(e => {
        console.log(e)
        return done(null, false, { message: 'Invalid username or password' });  
    })
}));

module.exports = passport