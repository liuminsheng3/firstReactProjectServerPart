const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
const HttpsProxyAgent = require('https-proxy-agent');
const agent = new HttpsProxyAgent(process.env.HTTP_PROXY || "http://127.0.0.1:8889");


const  gStrategy =  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      console.log('access token', accessToken);
      console.log('refresh token', refreshToken);
      console.log('profile:', profile);
    }
  );
gStrategy._oauth2.setAgent(agent);
passport.use(gStrategy);