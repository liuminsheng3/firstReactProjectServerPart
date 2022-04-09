const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
const HttpsProxyAgent = require('https-proxy-agent');
const mongoose = require('mongoose');



const User = mongoose.model("users");

passport.serializeUser((user, done) => {
  console.log("serialize",user);
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  const user = await User.findById(id);
  done(null, user);
  }
);

const  gStrategy =  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
    },
    //user has successfully signed in on google.
    async (accessToken, refreshToken, profile, done) => {
      console.log("successfully login on google!");
      
      const existingUser = await User.findOne({googleID: profile.id})

      if(existingUser){
        //we already have a record with the given ID
        console.log("this user already has an account");
        console.log(existingUser);

        done(null, existingUser);
      }else{
        //we don't have a user record with this ID,
        //make a new user
        console.log("this user doesn't have an account, create new one!");
        
        const user = await new User({googleID: profile.id}).save();

        done(null, user);
      }
    }
  );

if(process.env.NODE_ENV === 'production'){
  
  passport.use(gStrategy);

} else{
  const agent = new HttpsProxyAgent(process.env.HTTP_PROXY || "http://127.0.0.1:8889");
  gStrategy._oauth2.setAgent(agent);
  passport.use(gStrategy);
    
}