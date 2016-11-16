const passport         = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

//User Model
const User = require('../models/user.js');

//Auth Details
const auth = require('./auth.js');

//Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: auth.facebook.clientID,
    clientSecret: auth.facebook.clientSecret,
    callbackURL: auth.facebook.callbackURL,
    profileFields: ['id', 'emails', 'displayName', 'picture.type(large)']
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(() => {
      User.findOne({'id': profile.id}, (err, user) => {
        if(err)
          return done(err);
        if(user)
          return done(null, user);
        else {
          console.log(profile);
          let newUser         = new User();
          newUser.id          = profile.id;
          newUser.token       = accessToken;
          newUser.displayName = profile.displayName;
          newUser.email       = profile.emails ? profile.emails[0].value : '';
          newUser.photo       = profile.photos ? profile.photos[0].value : '/img/default-avatar.jpg'

          newUser.save((err) => {
            if(err) throw err;
            return done(null, newUser);
          });
        }
      });
    });
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findOne({id: id}, (err, user) => {
    done(err, user);
  });
});

module.exports.ensureAuthenticated = (req, res, next) => {
  if(req.isAuthenticated()) {
    next();
  }
  else {
    res.redirect('/');
  }
}

module.exports.AuthenticatedRedirect = (req, res, next) => {
  if(req.isAuthenticated()) {
    res.redirect('/chat');
  }
  else {
    next();
  }
}
