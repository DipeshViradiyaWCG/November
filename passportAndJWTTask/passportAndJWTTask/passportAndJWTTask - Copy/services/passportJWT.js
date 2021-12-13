const userModel = require("../models/users");
var passport = require('passport');

var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'asdfghjkllkjhgfdsaasdfghjkllkjhgfdsaasdfghjkllkjhgfdsaasdfghjkllkjhgfdsa';

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    console.log(jwt_payload.email);
    userModel.findOne({email: jwt_payload.email}, function(err, user) {
       if (err) {
           console.log(err);
           return done(err, false);
       }
       if (user) {
           console.log("User Data " + user);
           return done(null, user);
       } else {
           console.log('else');
           return done(null, false);
       }
   });
}));