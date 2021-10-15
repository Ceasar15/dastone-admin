const db = require("./db/db.js");
const passport =require('passport');
const localStrategy = require('passport-local');
const bcrypt = require('bcrypt')

passport.use(new localStrategy(async (username, password, done) => {
    let foundUser = await db.query('SELECT * FROM users WHERE username = $1', [username])
    if (foundUser.rows[0]) {
      let decrypted = await bcrypt.compare(password, foundUser.rows[0].password)
      if (decrypted) {
        done(null, foundUser.rows[0])
      }
      else {
        done(null, false)
      }
    }
    else {
      done(null, false)
    }
  }))
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser(async (userID, done) => {
    try {
      let foundUser = await db.query('SELECT * FROM users WHERE id = $1', [userID])
      done(null, foundUser.rows[0])
    }
    catch (err) {
      done(err, false)
    }
  })


  
  module.exports = passport

