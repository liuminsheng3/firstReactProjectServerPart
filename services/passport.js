const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
const HttpsProxyAgent = require('https-proxy-agent');
const agent = new HttpsProxyAgent(process.env.HTTP_PROXY || "http://127.0.0.1:8889");
const mongoose = require('mongoose');
const { download } = require('express/lib/response');

const User = mongoose.model("users");

passport.serializeUser((user, done) => {
  console.log("serialize",user);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id)
    .then(user =>{
      done(null, user);
    });
});

const  gStrategy =  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback'
    },
    //user has successfully signed in on google.
    (accessToken, refreshToken, profile, done) => {
      console.log("successfully login on google!");
      User.findOne({googleID: profile.id})
       .then((existingUser) => {
          if(existingUser){
            //we already have a record with the given ID
            console.log("this user already has an account");
            console.log(existingUser);

            done(null, existingUser);
          }else{
            //we don't have a user record with this ID,
            //make a new user
            console.log("this user doesn't have an account, create new one!");
            new User({googleID: profile.id}).save()
              .then(user => done(null, user));

          }
       })
    }
  );
gStrategy._oauth2.setAgent(agent);
passport.use(gStrategy);