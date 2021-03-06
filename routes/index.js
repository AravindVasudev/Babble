const express          = require('express');
const passport         = require('passport');
const router           = express.Router();

//User Model
const User = require('../models/user.js');

//Passport Config
const auth = require('../config/passport');

/* GET home page. */
router.get('/', auth.AuthenticatedRedirect, (req, res) => {
  let file = 'index';
  res.render(file, {
    meta: {
      title: 'Babble all time!',
      description: 'Babble is a simple to use chat app that let\'s you to have fun with your friends',
      keywords: 'chat, app, babble, instant, messaging',
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

router.get('/auth/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
