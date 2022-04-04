const passport  = require('passport');

module.exports = (app) => {

  //request to google auth.
  app.get(
      '/auth/google',
      passport.authenticate('google', {
        scope: ['profile', 'email']
      })
    );
    
  // when google auth successed, and return to this url.
  app.get('/auth/google/callback', passport.authenticate('google'));

  //handle when user use cookie info to request data.
  app.get('/api/current_user', (req, res) => {

    res.send(req.user);
  });

  //log out
  app.get('/api/logout', (req, res) =>{
    req.logout();
    res.send("you have successfully logged out");
  });
}