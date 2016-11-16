const express          = require('express');
const router           = express.Router();
const passport         = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

//User Model
const User = require('../models/user.js')

//Auth Details
const auth = require('../config/auth.js');

//Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: auth.facebook.clientID,
    clientSecret: auth.facebook.clientSecret,
    callbackURL: auth.facebook.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(() => {
      User.findOne({'id': profile.id}, (err, user) => {
        if(err)
          return done(err);
        if(user)
          return done(null, user);
        else {
          let newUser         = new User();
          newUser.id          = profile.id;
          newUser.token       = accessToken;
          newUser.displayName = profile.displayName;
          //newUser.email       = profile.emails[0].value;
          //newUser.photo       = profile.photos[0].value;

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

/* GET home page. */
router.get('/', (req, res) => {
  let file = 'index';
  res.render(file, {
    meta: {
      title: 'Express MVC H5BP',
      description: 'A simple boilerplate',
      keywords: 'Express, MVC, html5, boilerplate',
      file: file
    },
    title: 'Express MVC H5BP'
  });
});

//Redirects to Facebook
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

//Facebook's callback
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/chat',
                                      failureRedirect: '/' }));

router.get('/chat', ensureAuthenticated, (req, res) => {
  let file = 'chat';
  res.render(file, {
    meta: {
      title: 'Express MVC H5BP',
      description: 'A simple boilerplate',
      keywords: 'Express, MVC, html5, boilerplate',
      file: file
    }
  });
});

router.get('/auth/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    next();
  }
  else {
    res.redirect('/');
  }
}

module.exports = router;
