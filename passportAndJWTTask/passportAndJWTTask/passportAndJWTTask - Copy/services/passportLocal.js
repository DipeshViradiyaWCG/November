const userModel = require("../models/users");
const bcrypt = require("bcryptjs");

const passport = require("passport");
var LocalStrategy  = require('passport-local').Strategy;

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
    },
    
    function(username, password, done) {
        userModel.findOne({ email: username }, function(err, user) {
            
            console.log("Passport "+ username + "  " + password);
            console.log("UserData " + user);
            
            if (err) { return done(err); }
            
            if (!user) {
                return done(null, false, { message: 'Incorrect email.' });
            }
            bcrypt.compare(password, user.password, (err, resp) => {
                if(err || !resp){
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            });
        }); 
    }
));
  
passport.serializeUser(function(user, done) {
    done(null, user.email);
});
  
passport.deserializeUser(function(email, done) {
    userModel.findOne({ email:email }, function(err, user) {
        done(err, user);
    });
});