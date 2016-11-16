const express          = require('express');
const passport         = require('passport');
const router           = express.Router();

//User Model
const User = require('../models/user.js');

//Passport Config
const auth = require('../config/passport');

router.get('/', auth.ensureAuthenticated, (req, res) => {
  let file = 'chat';
  res.render(file, {
    meta: {
      title: 'Babble all time!',
      description: 'Babble is a simple to use chat app that let\'s you to have fun with your friends',
      keywords: 'chat, app, babble, instant, messaging',
      file: file
    },
    user: req.user
  });
});

module.exports = router;
